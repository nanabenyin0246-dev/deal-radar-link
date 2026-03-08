import { useState, useEffect, useCallback } from "react";

export interface RecentProduct {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  lowest_price: number;
  currency: string;
}

const STORAGE_KEY = "robcompare_recently_viewed";
const MAX_ITEMS = 6;

const getStored = (): RecentProduct[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useRecentlyViewed = () => {
  const [items, setItems] = useState<RecentProduct[]>(getStored);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(getStored());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addProduct = useCallback((product: RecentProduct) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const next = [product, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  }, []);

  return { recentProducts: items, addProduct, clearAll };
};
