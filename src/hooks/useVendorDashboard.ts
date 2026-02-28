import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useVendorProducts = () => {
  const { vendorId } = useAuth();
  return useQuery({
    queryKey: ["vendor-products", vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const { data, error } = await supabase
        .from("vendor_offers")
        .select(`
          *,
          product:products(id, name, slug, brand, image_url, category:categories(name))
        `)
        .eq("vendor_id", vendorId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });
};

export const useVendorProfile = () => {
  const { vendorId } = useAuth();
  return useQuery({
    queryKey: ["vendor-profile", vendorId],
    queryFn: async () => {
      if (!vendorId) return null;
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", vendorId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { vendorId } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      brand: string;
      description: string;
      image_url: string;
      category_id: string;
      price: number;
      currency: string;
      whatsapp_message?: string;
      payment_link?: string;
    }) => {
      // Create product
      const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data: product, error: pErr } = await supabase
        .from("products")
        .insert({
          name: input.name,
          slug: slug + "-" + Date.now(),
          brand: input.brand,
          description: input.description,
          image_url: input.image_url,
          category_id: input.category_id,
        })
        .select()
        .single();
      if (pErr) throw pErr;

      // Create vendor offer
      const { error: oErr } = await supabase
        .from("vendor_offers")
        .insert({
          product_id: product.id,
          vendor_id: vendorId!,
          price: input.price,
          currency: input.currency,
          whatsapp_message: input.whatsapp_message,
          payment_link: input.payment_link,
        });
      if (oErr) throw oErr;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
    },
  });
};

export const useToggleOfferVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ offerId, visible }: { offerId: string; visible: boolean }) => {
      const { error } = await supabase
        .from("vendor_offers")
        .update({ is_visible: visible })
        .eq("id", offerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ offerId, data }: { offerId: string; data: { price?: number; currency?: string; whatsapp_message?: string; payment_link?: string; in_stock?: boolean } }) => {
      const { error } = await supabase
        .from("vendor_offers")
        .update(data)
        .eq("id", offerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: { name?: string; brand?: string; description?: string; image_url?: string; category_id?: string } }) => {
      const { error } = await supabase
        .from("products")
        .update(data)
        .eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ offerId, productId }: { offerId: string; productId: string }) => {
      // Delete vendor offer first
      const { error: oErr } = await supabase
        .from("vendor_offers")
        .delete()
        .eq("id", offerId);
      if (oErr) throw oErr;
      // Deactivate product (don't hard delete, other vendors might reference it)
      await supabase
        .from("products")
        .update({ is_active: false })
        .eq("id", productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUploadProductImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      return urlData.publicUrl;
    },
  });
};
