import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const FeaturedVendors = () => {
  const { data: vendors, isLoading } = useQuery({
    queryKey: ["featured-vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("id, business_name, country, verified, logo_url")
        .eq("status", "approved")
        .order("created_at", { ascending: true })
        .limit(20);
      if (error) throw error;

      // Get product counts per vendor
      const vendorIds = data.map((v) => v.id);
      const { data: offers } = await supabase
        .from("vendor_offers")
        .select("vendor_id")
        .in("vendor_id", vendorIds)
        .eq("is_visible", true);

      const countMap: Record<string, number> = {};
      offers?.forEach((o) => {
        countMap[o.vendor_id] = (countMap[o.vendor_id] || 0) + 1;
      });

      return data.map((v) => ({ ...v, productCount: countMap[v.id] || 0 }));
    },
  });

  if (isLoading || !vendors?.length) return null;

  const countryFlags: Record<string, string> = {
    Ghana: "🇬🇭", Nigeria: "🇳🇬", Kenya: "🇰🇪",
    "South Africa": "🇿🇦", Senegal: "🇸🇳", Tanzania: "🇹🇿",
    Uganda: "🇺🇬", Cameroon: "🇨🇲", "Côte d'Ivoire": "🇨🇮",
    Rwanda: "🇷🇼", Ethiopia: "🇪🇹",
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Trusted Vendors</h2>
          <p className="text-muted-foreground mt-1 text-sm">Meet the founding vendors on RobCompare</p>
        </div>

        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4 px-1">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="flex-shrink-0 w-48 bg-card border border-border rounded-xl p-4 text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  {v.logo_url ? (
                    <img src={v.logo_url} alt={v.business_name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <Store className="w-5 h-5 text-primary" />
                  )}
                </div>
                <p className="font-heading font-semibold text-sm truncate flex items-center justify-center gap-1">
                  {v.business_name}
                  {v.verified && <Shield className="w-3 h-3 text-primary shrink-0" />}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {countryFlags[v.country] || "🌍"} {v.country}
                </p>
                <Badge variant="outline" className="mt-2 text-[10px]">
                  {v.productCount} product{v.productCount !== 1 ? "s" : ""}
                </Badge>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default FeaturedVendors;
