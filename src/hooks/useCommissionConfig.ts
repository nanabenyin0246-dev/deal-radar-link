import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCommissionConfig = () => {
  return useQuery({
    queryKey: ["commission-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commission_config")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });
};

export const useUserCount = () => {
  return useQuery({
    queryKey: ["user-count"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_count");
      if (error) throw error;
      return data as number;
    },
  });
};
