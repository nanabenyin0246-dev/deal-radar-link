import { useState, useMemo, useCallback } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ArrowUpDown, Filter } from "lucide-react";
import { useProducts, useCategories, LiveProduct } from "@/hooks/useProducts";
import LiveProductCard from "@/components/LiveProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import EmptyState from "@/components/EmptyState";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BarcodeScanner from "@/components/BarcodeScanner";
import ProductSummary from "@/components/ProductSummary";
import { useDebounce } from "@/hooks/useDebounce";
import { calculateDealScore } from "@/utils/dealScore";
import SEOHead from "@/components/SEOHead";
import { formatDistanceToNow } from "date-fns";

type SortOption = "price_asc" | "price_desc" | "deal_score" | "newest";
const ITEMS_PER_PAGE = 12;

const SORT_LABELS: Record<SortOption, string> = {
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  deal_score: "Deal Score: Best First",
  newest: "Newest First",
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read all filter state from URL
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSort = (searchParams.get("sort") as SortOption) || "newest";
  const initialVerifiedOnly = searchParams.get("verified") === "true";
  const initialMinPrice = Number(searchParams.get("min_price")) || 0;
  const initialMaxPrice = Number(searchParams.get("max_price")) || 0;

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? initialCategory.split(",") : []
  );
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [verifiedOnly, setVerifiedOnly] = useState(initialVerifiedOnly);
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("in_stock") === "true");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedQuery = useDebounce(query, 300);
  const { recentProducts } = useRecentlyViewed();

  const { data: products, isLoading } = useProducts(debouncedQuery || undefined);
  const { data: categories } = useCategories();

  // Sync filters to URL
  const updateUrl = useCallback((overrides: Record<string, string>) => {
    const params: Record<string, string> = {};
    const q = overrides.q ?? query;
    const cats = overrides.category ?? selectedCategories.join(",");
    const s = overrides.sort ?? sort;
    const v = overrides.verified ?? (verifiedOnly ? "true" : "");
    const inS = overrides.in_stock ?? (inStockOnly ? "true" : "");
    const minP = overrides.min_price ?? (priceRange[0] > 0 ? String(priceRange[0]) : "");
    const maxP = overrides.max_price ?? (priceRange[1] > 0 ? String(priceRange[1]) : "");

    if (q) params.q = q;
    if (cats) params.category = cats;
    if (s && s !== "newest") params.sort = s;
    if (v) params.verified = v;
    if (inS) params.in_stock = inS;
    if (minP) params.min_price = minP;
    if (maxP) params.max_price = maxP;

    setSearchParams(params, { replace: true });
  }, [query, selectedCategories, sort, verifiedOnly, inStockOnly, priceRange, setSearchParams]);

  // Compute price bounds for slider
  const priceBounds = useMemo(() => {
    if (!products?.length) return { min: 0, max: 10000 };
    const prices = products.flatMap(p => p.vendor_offers.map(o => o.price));
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  // Apply client-side filters and sorting
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => p.category && selectedCategories.includes(p.category.slug));
    }

    // Verified filter
    if (verifiedOnly) {
      result = result.filter(p =>
        p.vendor_offers.some(o => o.vendor.verified)
      );
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter(p =>
        p.vendor_offers.some(o => o.in_stock !== false)
      );
    }

    // Price range filter
    if (priceRange[0] > 0 || priceRange[1] > 0) {
      result = result.filter(p => {
        const cheapest = Math.min(...p.vendor_offers.map(o => o.price));
        if (priceRange[0] > 0 && cheapest < priceRange[0]) return false;
        if (priceRange[1] > 0 && cheapest > priceRange[1]) return false;
        return true;
      });
    }

    // Sort
    const getLowestPrice = (p: LiveProduct) =>
      Math.min(...p.vendor_offers.map(o => o.price));

    const getDealScoreForProduct = (p: LiveProduct) => {
      const offers = p.vendor_offers;
      const avg = offers.reduce((s, o) => s + o.price, 0) / offers.length;
      const cheapest = offers.reduce((best, o) => o.price < best.price ? o : best, offers[0]);
      return calculateDealScore({
        price: cheapest.price,
        averagePrice: avg,
        vendorVerified: cheapest.vendor.verified || false,
        updatedAt: cheapest.updated_at,
      });
    };

    switch (sort) {
      case "price_asc":
        result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
        break;
      case "price_desc":
        result.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
        break;
      case "deal_score":
        result.sort((a, b) => getDealScoreForProduct(b) - getDealScoreForProduct(a));
        break;
      case "newest":
        // Already sorted by created_at desc from API
        break;
    }

    return result;
  }, [products, selectedCategories, verifiedOnly, inStockOnly, priceRange, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleCategory = (slug: string) => {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter(c => c !== slug)
      : [...selectedCategories, slug];
    setSelectedCategories(next);
    updateUrl({ category: next.join(",") });
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setSort("newest");
    setVerifiedOnly(false);
    setInStockOnly(false);
    setPriceRange([0, 0]);
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasFilters = query || selectedCategories.length > 0 || verifiedOnly || priceRange[0] > 0 || priceRange[1] > 0;

  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Categories</h4>
        <div className="space-y-2">
          {categories?.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <span>{cat.icon} {cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Price Range</h4>
        <Slider
          min={priceBounds.min}
          max={priceBounds.max}
          step={10}
          value={[priceRange[0] || priceBounds.min, priceRange[1] || priceBounds.max]}
          onValueChange={([min, max]) => {
            setPriceRange([min, max]);
            updateUrl({ min_price: String(min), max_price: String(max) });
          }}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>GHS {priceRange[0] || priceBounds.min}</span>
          <span>GHS {priceRange[1] || priceBounds.max}</span>
        </div>
      </div>

      {/* Verified Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="verified-toggle" className="text-sm">Verified vendors only</Label>
        <Switch
          id="verified-toggle"
          checked={verifiedOnly}
          onCheckedChange={(v) => {
            setVerifiedOnly(v);
            updateUrl({ verified: v ? "true" : "" });
          }}
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Browse Products"
        description="Compare prices across verified vendors in Africa. Find the best deals on electronics, fashion, beauty and more."
        path="/products"
      />
      <Navbar />
      <div className="container py-8">
        {/* Search bar + Sort */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center bg-card border border-border rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                updateUrl({ q: e.target.value });
              }}
              className="flex-1 ml-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
            />
            {query && (
              <button onClick={() => { setQuery(""); updateUrl({ q: "" }); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort dropdown - desktop */}
          <div className="hidden md:block">
            <Select value={sort} onValueChange={(v) => { setSort(v as SortOption); updateUrl({ sort: v }); }}>
              <SelectTrigger className="w-48">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SORT_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile filter trigger */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 h-11 w-11 md:hidden">
                <Filter className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Filters & Sort</SheetTitle>
              </SheetHeader>
              <div className="mt-4 overflow-y-auto">
                {/* Mobile sort */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3">Sort by</h4>
                  <Select value={sort} onValueChange={(v) => { setSort(v as SortOption); updateUrl({ sort: v }); }}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SORT_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {filterContent}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Barcode Scanner */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <BarcodeScanner onProductFound={(p) => { setQuery(p.title); updateUrl({ q: p.title }); }} />
        </div>

        {debouncedQuery && debouncedQuery.length >= 3 && (
          <div className="mb-6">
            <ProductSummary productName={debouncedQuery} />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop filter sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-5">
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h3>
              {filterContent}
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Searching..." : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear all</button>
              )}
            </div>

            {/* Recently viewed suggestions when no query */}
            {!debouncedQuery && recentProducts.length > 0 && (
              <div className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-sm font-bold text-muted-foreground mb-3">Based on your recent views</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                  {recentProducts.map((rp) => (
                    <a
                      key={rp.id}
                      href={`/product/${rp.slug}`}
                      className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded bg-muted overflow-hidden">
                        <img src={rp.image_url || "/placeholder-product.svg"} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/placeholder-product.svg"; }} />
                      </div>
                      <span className="text-sm text-foreground whitespace-nowrap">{rp.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <ProductCardSkeleton key={i} />)}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map(product => (
                    <LiveProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .map((page, idx, arr) => {
                          const prev = arr[idx - 1];
                          const showEllipsis = prev && page - prev > 1;
                          return (
                            <span key={page} className="flex items-center gap-1">
                              {showEllipsis && <span className="text-muted-foreground px-1">…</span>}
                              <Button
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                className="w-9 h-9 p-0"
                                onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                              >
                                {page}
                              </Button>
                            </span>
                          );
                        })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState onAction={clearFilters} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
