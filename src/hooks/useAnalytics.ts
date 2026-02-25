import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "./useAdmin";

export const useAnalyticsMetrics = () => {
  const { data: isAdmin } = useIsAdmin();
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch all data in parallel
      const [vendorsRes, productsRes, ordersRes, offersRes] = await Promise.all([
        supabase.from("vendors").select("id, created_at, status").gte("created_at", thirtyDaysAgo),
        supabase.from("products").select("id, created_at").eq("is_active", true),
        supabase.from("orders").select("id, created_at, status, total_price, currency, commission_amount"),
        supabase.from("vendor_offers").select("id, views, clicks, is_visible").eq("is_visible", true),
      ]);

      const vendors30d = vendorsRes.data || [];
      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const offers = offersRes.data || [];

      const orders30d = orders.filter(o => new Date(o.created_at) >= new Date(thirtyDaysAgo));
      const completedOrders = orders.filter(o => o.status === "completed");
      const completedOrders30d = orders30d.filter(o => o.status === "completed");

      const totalViews = offers.reduce((s, o) => s + (o.views || 0), 0);
      const totalClicks = offers.reduce((s, o) => s + (o.clicks || 0), 0);
      const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

      const gmv = completedOrders.reduce((s, o) => s + Number(o.total_price || 0), 0);
      const gmv30d = completedOrders30d.reduce((s, o) => s + Number(o.total_price || 0), 0);
      const commission30d = orders30d.reduce((s, o) => s + Number(o.commission_amount || 0), 0);

      return {
        acquisition: {
          vendorSignups30d: vendors30d.length,
          productsListed: products.length,
        },
        engagement: {
          totalViews,
          totalClicks,
          clickConversionRate: clickRate,
        },
        revenue: {
          ordersCreated: orders.length,
          ordersCreated30d: orders30d.length,
          ordersCompleted: completedOrders.length,
          ordersCompleted30d: completedOrders30d.length,
          gmv,
          gmv30d,
          commissionEarned30d: commission30d,
        },
      };
    },
    enabled: !!isAdmin,
  });
};
