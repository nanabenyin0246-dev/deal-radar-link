import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/utils/currency";
import { X } from "lucide-react";

const LiveTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("ticker-dismissed") === "1");

  const { data: messages } = useQuery({
    queryKey: ["live-ticker"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendor_offers")
        .select("price, currency, product:products(name, slug)")
        .eq("is_visible", true)
        .order("updated_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data || []).map((o: any) => ({
        text: `🔥 ${o.product?.name || "New product"} — ${formatPrice(o.price, o.currency)} from a verified vendor`,
        slug: o.product?.slug,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const items = messages?.length ? messages : [
    { text: "🔥 New deals added daily — compare and save!", slug: null },
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

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("ticker-dismissed", "1");
    setDismissed(true);
  };

  return (
    <div className="bg-primary/10 border-b border-primary/20 py-2 overflow-hidden">
      <div className="container flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-foreground hidden sm:inline">Live Deals</span>
        </div>
        <p
          className={`text-xs text-center text-muted-foreground transition-opacity duration-500 ease-in-out flex-1 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          {items[currentIndex]?.text}
        </p>
        <button onClick={handleDismiss} className="shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default LiveTicker;
