import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useWishlist = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", userId!);
      return new Set(data?.map((w: any) => w.product_id) || []);
    },
    enabled: !!userId,
  });
};

export const useToggleWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, productId, isSaved }: { userId: string; productId: string; isSaved: boolean }) => {
      if (isSaved) {
        await supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", productId);
      } else {
        await supabase.from("wishlists").insert({ user_id: userId, product_id: productId });
      }
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["wishlist", vars.userId] }),
  });
};

export const useWishlistProducts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["wishlist-products", userId],
    queryFn: async () => {
      const { data: wishItems } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", userId!);
      if (!wishItems?.length) return [];
      const productIds = wishItems.map((w: any) => w.product_id);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug, icon),
          vendor_offers(
            id, price, currency, in_stock, is_visible, shipping_days,
            whatsapp_message, payment_link, variant_info, views, clicks, updated_at,
            vendor:vendors(id, business_name, whatsapp_number, trust_score, verified, country, city, logo_url)
          )
        `)
        .in("id", productIds)
        .eq("is_active", true);
      if (error) throw error;
      return (data || []).map((p: any) => ({
        ...p,
        vendor_offers: (p.vendor_offers || []).filter((vo: any) => vo.is_visible),
      })).filter((p: any) => p.vendor_offers.length > 0);
    },
    enabled: !!userId,
  });
};
