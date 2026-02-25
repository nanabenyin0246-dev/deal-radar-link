import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useBuyerOrders = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["buyer-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          product:products(name, slug, image_url),
          vendor:vendors(business_name, whatsapp_number)
        `)
        .eq("buyer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useVendorOrders = () => {
  const { vendorId } = useAuth();
  return useQuery({
    queryKey: ["vendor-orders", vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          product:products(name, slug, image_url),
          vendor:vendors(business_name)
        `)
        .eq("vendor_id", vendorId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const updateData: Record<string, any> = { status };
      if (status === "delivered") updateData.delivered_at = new Date().toISOString();
      if (status === "completed") updateData.completed_at = new Date().toISOString();
      
      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: {
      vendor_offer_id: string;
      vendor_id: string;
      product_id: string;
      unit_price: number;
      currency: string;
      payment_method: string;
    }) => {
      const commissionRate = 0.08;
      const commissionAmount = input.unit_price * commissionRate;
      const { data, error } = await supabase
        .from("orders")
        .insert({
          buyer_id: user!.id,
          vendor_offer_id: input.vendor_offer_id,
          vendor_id: input.vendor_id,
          product_id: input.product_id,
          unit_price: input.unit_price,
          total_price: input.unit_price,
          currency: input.currency,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          payment_method: input.payment_method,
          status: "pending" as const,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
    },
  });
};

export const useCreateDispute = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { order_id: string; reason: string; description?: string }) => {
      const { data, error } = await supabase
        .from("disputes")
        .insert({
          order_id: input.order_id,
          opened_by: user!.id,
          reason: input.reason,
          description: input.description,
          status: "open" as const,
        })
        .select()
        .single();
      if (error) throw error;

      // Update order status to disputed
      await supabase.from("orders").update({ status: "disputed" as const }).eq("id", input.order_id);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
    },
  });
};

export const useAuditLog = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { action: string; entity_type: string; entity_id?: string; details?: Record<string, any> }) => {
      await supabase.from("audit_log").insert({
        user_id: user?.id,
        action: input.action,
        entity_type: input.entity_type,
        entity_id: input.entity_id,
        details: input.details || {},
      });
    },
  });
};
