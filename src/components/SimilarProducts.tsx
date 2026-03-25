import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LiveProductCard from "@/components/LiveProductCard";
import { LiveProduct } from "@/hooks/useProducts";

interface SimilarProductsProps {
  categoryId: string;
  currentProductId: string;
}

const SimilarProducts = ({ categoryId, currentProductId }: SimilarProductsProps) => {
  const { data: products } = useQuery({
    queryKey: ["similar-products", categoryId, currentProductId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug, icon),
          vendor_offers(
            id, price, currency, in_stock, is_visible, shipping_days,
            whatsapp_message, payment_link, variant_info, views, clicks,
            created_at, updated_at,
            vendor:vendors(id, business_name, country, city, whatsapp_number, verified, trust_score, logo_url)
          )
        `)
        .eq("is_active", true)
        .eq("category_id", categoryId)
        .neq("id", currentProductId)
        .limit(4);
      if (error) throw error;
      return (data || []).filter((p: any) => p.vendor_offers?.some((o: any) => o.is_visible)) as LiveProduct[];
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });

  if (!products?.length) return null;

  return (
    <div className="mb-12">
      <h2 className="font-heading text-xl font-bold mb-4">You might also like</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
        {products.map((product) => (
          <div key={product.id} className="min-w-[240px] max-w-[280px] snap-start shrink-0">
            <LiveProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
