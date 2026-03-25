import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*, reviewer:profiles(display_name)")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!productId,
  });
};

export const useSubmitReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (review: {
      product_id: string;
      vendor_id: string;
      order_id: string;
      rating: number;
      title: string;
      body: string;
      user_id: string;
    }) => {
      const { error } = await supabase.from("product_reviews").insert(review);
      if (error) throw error;
      const { data: allReviews } = await supabase
        .from("product_reviews")
        .select("rating")
        .eq("product_id", review.product_id);
      if (allReviews?.length) {
        const avg = allReviews.reduce((s: number, r: any) => s + r.rating, 0) / allReviews.length;
        await supabase.from("products").update({
          rating: Math.round(avg * 10) / 10,
          review_count: allReviews.length,
        }).eq("id", review.product_id);
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["product-reviews", vars.product_id] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
};
