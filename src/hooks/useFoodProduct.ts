import { useMutation, useQuery } from "@tanstack/react-query";

export interface FoodProduct {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  ingredients: string;
  nutritionGrade: string;
  quantity: string;
  countries: string;
  labels: string;
}

const OFF_API = "https://world.openfoodfacts.org";

export const useFoodProductLookup = () => {
  return useMutation({
    mutationFn: async (barcode: string): Promise<FoodProduct | null> => {
      const res = await fetch(`${OFF_API}/api/v0/product/${barcode}.json`);
      if (!res.ok) throw new Error("Open Food Facts lookup failed");
      const data = await res.json();

      if (data.status !== 1 || !data.product) return null;

      const p = data.product;
      return {
        barcode,
        name: p.product_name || p.product_name_en || "",
        brand: p.brands || "",
        category: p.categories?.split(",")[0]?.trim() || "Food & Grocery",
        imageUrl: p.image_url || p.image_front_url || "",
        ingredients: p.ingredients_text || "",
        nutritionGrade: p.nutrition_grades || "",
        quantity: p.quantity || "",
        countries: p.countries || "",
        labels: p.labels || "",
      };
    },
  });
};

export const useFoodProductSearch = (query: string) => {
  return useQuery({
    queryKey: ["off-search", query],
    queryFn: async (): Promise<FoodProduct[]> => {
      const res = await fetch(
        `${OFF_API}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`
      );
      if (!res.ok) return [];
      const data = await res.json();

      return (data.products || []).slice(0, 5).map((p: any) => ({
        barcode: p.code || "",
        name: p.product_name || p.product_name_en || "",
        brand: p.brands || "",
        category: p.categories?.split(",")[0]?.trim() || "Food & Grocery",
        imageUrl: p.image_url || p.image_front_url || "",
        ingredients: p.ingredients_text || "",
        nutritionGrade: p.nutrition_grades || "",
        quantity: p.quantity || "",
        countries: p.countries || "",
        labels: p.labels || "",
      }));
    },
    enabled: query.length >= 3,
    staleTime: 1000 * 60 * 10,
  });
};

export const nutritionGradeConfig: Record<string, { label: string; colorClass: string }> = {
  a: { label: "A", colorClass: "bg-green-500 text-white" },
  b: { label: "B", colorClass: "bg-lime-500 text-white" },
  c: { label: "C", colorClass: "bg-yellow-500 text-white" },
  d: { label: "D", colorClass: "bg-orange-500 text-white" },
  e: { label: "E", colorClass: "bg-red-500 text-white" },
};
