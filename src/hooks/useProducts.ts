import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LiveProduct {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  description: string | null;
  image_url: string | null;
  images: string[] | null;
  rating: number | null;
  review_count: number | null;
  is_active: boolean | null;
  category_id: string | null;
  category?: { id: string; name: string; slug: string; icon: string | null };
  vendor_offers: LiveVendorOffer[];
}

export interface LiveVendorOffer {
  id: string;
  price: number;
  currency: string;
  in_stock: boolean | null;
  is_visible: boolean | null;
  shipping_days: number | null;
  whatsapp_message: string | null;
  payment_link: string | null;
  variant_info: any;
  views: number | null;
  clicks: number | null;
  updated_at: string;
  vendor: {
    id: string;
    business_name: string;
    whatsapp_number: string;
    trust_score: number | null;
    verified: boolean | null;
    country: string;
    logo_url: string | null;
  };
}

export const useProducts = (query?: string, categorySlug?: string) => {
  return useQuery({
    queryKey: ["products", query, categorySlug],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug, icon),
          vendor_offers(
            id, price, currency, in_stock, is_visible, shipping_days,
            whatsapp_message, payment_link, variant_info, views, clicks,
            vendor:vendors(id, business_name, whatsapp_number, trust_score, verified, country, city, logo_url)
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (query) {
        q = q.or(`name.ilike.%${query}%,brand.ilike.%${query}%`);
      }

      const { data, error } = await q;
      if (error) throw error;

      let products = (data as unknown as LiveProduct[]) || [];

      // Filter by category slug if provided
      if (categorySlug) {
        products = products.filter((p) => p.category?.slug === categorySlug);
      }

      // Only show products that have at least one visible offer
      products = products.map((p) => ({
        ...p,
        vendor_offers: (p.vendor_offers || []).filter((vo) => vo.is_visible),
      })).filter((p) => p.vendor_offers.length > 0);

      return products;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug, icon),
          vendor_offers(
            id, price, currency, in_stock, is_visible, shipping_days,
            whatsapp_message, payment_link, variant_info, views, clicks,
            vendor:vendors(id, business_name, whatsapp_number, trust_score, verified, country, logo_url)
          )
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as LiveProduct | null;
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug, icon),
          vendor_offers(
            id, price, currency, in_stock, is_visible, shipping_days,
            whatsapp_message, payment_link, variant_info, views, clicks,
            vendor:vendors(id, business_name, whatsapp_number, trust_score, verified, country, logo_url)
          )
        `)
        .eq("is_active", true)
        .order("rating", { ascending: false })
        .limit(6);

      if (error) throw error;

      return ((data as unknown as LiveProduct[]) || [])
        .map((p) => ({
          ...p,
          vendor_offers: (p.vendor_offers || []).filter((vo) => vo.is_visible),
        }))
        .filter((p) => p.vendor_offers.length > 0);
    },
  });
};
