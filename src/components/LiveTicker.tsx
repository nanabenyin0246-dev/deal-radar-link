import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/utils/currency";
import { Flame } from "lucide-react";

const LiveTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const { data: messages } = useQuery({
    queryKey: ["live-ticker"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendor_offers")
        .select("price, currency, product:products(name)")
        .eq("is_visible", true)
        .order("updated_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return (data || []).map((o: any) => ({
        text: `🔥 ${o.product?.name || "New product"} now available from ${formatPrice(o.price, o.currency)}`,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const items = messages?.length ? messages : [
    { text: "🔥 New deals added daily — compare and save!" },
  ];

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="bg-primary/5 border-b border-primary/10 py-2 overflow-hidden">
      <div className="container">
        <p
          className={`text-xs text-center text-muted-foreground transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          {items[currentIndex]?.text}
        </p>
      </div>
    </div>
  );
};

export default LiveTicker;
