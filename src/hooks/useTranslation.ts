import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProductTranslations = (productId: string) => {
  return useQuery({
    queryKey: ["product-translations", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_translations")
        .select("*")
        .eq("product_id", productId);
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
};

export const useAutoTranslate = () => {
  return useMutation({
    mutationFn: async ({ productId, sourceLang = "en" }: { productId: string; sourceLang?: string }) => {
      const { data, error } = await supabase.functions.invoke("translate-product", {
        body: { product_id: productId, source_lang: sourceLang },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
  });
};

export const useApproveTranslation = () => {
  return useMutation({
    mutationFn: async ({ translationId, approved }: { translationId: string; approved: boolean }) => {
      const { error } = await supabase
        .from("product_translations")
        .update({ approved })
        .eq("id", translationId);
      if (error) throw error;
    },
  });
};

export const useUpdateTranslation = () => {
  return useMutation({
    mutationFn: async ({ translationId, name, description }: { translationId: string; name: string; description?: string }) => {
      const { error } = await supabase
        .from("product_translations")
        .update({ name, description, auto_translated: false })
        .eq("id", translationId);
      if (error) throw error;
    },
  });
};
