import { useMutation, useQuery } from "@tanstack/react-query";

interface UPCProduct {
  ean: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  images: string[];
  offers: { merchant: string; price: string; currency: string; link: string }[];
}

const UPC_API = "https://api.upcitemdb.com/prod/trial/lookup";

export const useBarcodeLookup = () => {
  return useMutation({
    mutationFn: async (upc: string): Promise<UPCProduct | null> => {
      const res = await fetch(`${UPC_API}?upc=${encodeURIComponent(upc)}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        if (res.status === 429) throw new Error("Daily barcode lookup limit reached (100/day)");
        throw new Error("Barcode lookup failed");
      }
      const data = await res.json();
      if (!data.items?.length) return null;
      const item = data.items[0];
      return {
        ean: item.ean || upc,
        title: item.title || "",
        description: item.description || "",
        brand: item.brand || "",
        category: item.category || "",
        images: item.images || [],
        offers: (item.offers || []).map((o: any) => ({
          merchant: o.merchant || "",
          price: o.price?.toString() || "",
          currency: o.currency || "USD",
          link: o.link || "",
        })),
      };
    },
  });
};

export const useBarcodeSearch = (query: string) => {
  return useQuery({
    queryKey: ["barcode-search", query],
    queryFn: async (): Promise<UPCProduct[]> => {
      const res = await fetch(
        `https://api.upcitemdb.com/prod/trial/search?s=${encodeURIComponent(query)}&type=product`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return (data.items || []).map((item: any) => ({
        ean: item.ean || "",
        title: item.title || "",
        description: item.description || "",
        brand: item.brand || "",
        category: item.category || "",
        images: item.images || [],
        offers: [],
      }));
    },
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000,
  });
};
