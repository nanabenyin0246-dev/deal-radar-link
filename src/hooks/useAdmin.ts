import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useIsAdmin = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin");
      return (data?.length || 0) > 0;
    },
    enabled: !!user,
  });
};

export const useAdminOrders = () => {
  const { data: isAdmin } = useIsAdmin();
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          product:products(name, slug, image_url),
          vendor:vendors(business_name, whatsapp_number)
        `)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });
};

export const useAdminDisputes = () => {
  const { data: isAdmin } = useIsAdmin();
  return useQuery({
    queryKey: ["admin-disputes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("disputes")
        .select(`
          *,
          order:orders(
            id, status, total_price, currency,
            product:products(name),
            vendor:vendors(business_name)
          )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });
};

export const useAdminVendors = () => {
  const { data: isAdmin } = useIsAdmin();
  return useQuery({
    queryKey: ["admin-vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });
};

export const useUpdateVendorStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vendorId, status, suspensionReason }: { vendorId: string; status: string; suspensionReason?: string }) => {
      const updateData: Record<string, any> = { status };
      if (status === "suspended") {
        updateData.suspended_at = new Date().toISOString();
        updateData.suspension_reason = suspensionReason || "Policy violation";
      }
      const { error } = await supabase.from("vendors").update(updateData).eq("id", vendorId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
    },
  });
};

export const useResolveDispute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ disputeId, decision, status, orderId }: { disputeId: string; decision: string; status: string; orderId: string }) => {
      await supabase.from("disputes").update({
        admin_decision: decision,
        status: status as any,
        resolved_at: new Date().toISOString(),
      }).eq("id", disputeId);

      // Update order status based on resolution
      const orderStatus = status === "resolved_buyer" ? "refunded" : "completed";
      await supabase.from("orders").update({ status: orderStatus as any }).eq("id", orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-disputes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
};

export const useAdminCommissions = () => {
  const { data: isAdmin } = useIsAdmin();
  return useQuery({
    queryKey: ["admin-commissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select(`
          *,
          vendor:vendors(business_name),
          order:orders(id, status, currency)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });
};

export const useAdminAuditLog = () => {
  const { data: isAdmin } = useIsAdmin();
  return useQuery({
    queryKey: ["admin-audit-log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });
};

export const useToggleFraudFlag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vendorId, flagged }: { vendorId: string; flagged: boolean }) => {
      const { error } = await supabase.from("vendors").update({ fraud_flagged: flagged }).eq("id", vendorId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
    },
  });
};
