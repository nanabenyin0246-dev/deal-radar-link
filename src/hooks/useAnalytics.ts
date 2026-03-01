import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "./useAdmin";

export const useAnalyticsMetrics = () => {
  const { data: isAdmin } = useIsAdmin();
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [vendorsRes, productsRes, ordersRes, offersRes, userCountRes, ordersByStatusRes] = await Promise.all([
        supabase.from("vendors").select("id, created_at, status").gte("created_at", thirtyDaysAgo),
        supabase.from("products").select("id, created_at").eq("is_active", true),
        supabase.from("orders").select("id, created_at, status, total_price, currency, commission_amount"),
        supabase.from("vendor_offers").select("id, views, clicks, is_visible").eq("is_visible", true),
        supabase.rpc("get_user_count"),
        supabase.rpc("get_orders_by_status"),
      ]);

      const vendors30d = vendorsRes.data || [];
      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const offers = offersRes.data || [];
      const totalUsers = (userCountRes.data as number) || 0;
      const ordersByStatus = (ordersByStatusRes.data as Array<{ status: string; count: number; total_revenue: number }>) || [];

      // All vendors (not just 30d)
      const { data: allVendors } = await supabase.from("vendors").select("id");
      const totalVendors = allVendors?.length || 0;

      const orders30d = orders.filter(o => new Date(o.created_at) >= new Date(thirtyDaysAgo));
      const completedOrders = orders.filter(o => o.status === "completed");
      const completedOrders30d = orders30d.filter(o => o.status === "completed");

      const totalViews = offers.reduce((s, o) => s + (o.views || 0), 0);
      const totalClicks = offers.reduce((s, o) => s + (o.clicks || 0), 0);
      const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

      const gmv = completedOrders.reduce((s, o) => s + Number(o.total_price || 0), 0);
      const gmv30d = completedOrders30d.reduce((s, o) => s + Number(o.total_price || 0), 0);
      const commission30d = orders30d.reduce((s, o) => s + Number(o.commission_amount || 0), 0);
      const totalRevenue = orders.filter(o => o.status === "completed").reduce((s, o) => s + Number(o.total_price || 0), 0);

      return {
        overview: {
          totalUsers,
          totalVendors,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          ordersByStatus,
        },
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
