import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PriceAlert {
  id: string;
  user_id: string;
  product_id: string;
  target_price: number;
  currency: string;
  active: boolean;
  created_at: string;
}

export const usePriceAlerts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["price-alerts", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_alerts" as any)
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as PriceAlert[];
    },
    enabled: !!userId,
  });
};

export const useCreatePriceAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (alert: { user_id: string; product_id: string; target_price: number; currency: string }) => {
      const { data, error } = await supabase
        .from("price_alerts" as any)
        .insert(alert as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as PriceAlert;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["price-alerts", vars.user_id] });
    },
  });
};

export const useDeletePriceAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase
        .from("price_alerts" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
      return userId;
    },
    onSuccess: (userId) => {
      qc.invalidateQueries({ queryKey: ["price-alerts", userId] });
    },
  });
};
