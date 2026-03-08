import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import LiveProductCard from "@/components/LiveProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import EmptyState from "@/components/EmptyState";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import BarcodeScanner from "@/components/BarcodeScanner";
import ProductSummary from "@/components/ProductSummary";
import { useDebounce } from "@/hooks/useDebounce";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const { data: products, isLoading } = useProducts(debouncedQuery || undefined, selectedCategory || undefined);
  const { data: categories } = useCategories();

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setSearchParams({});
  };

  const hasFilters = query || selectedCategory;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        {/* Search bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center bg-card border border-border rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 ml-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button variant="outline" size="icon" className="shrink-0 h-11 w-11" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Barcode Scanner + DuckDuckGo Summary */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <BarcodeScanner onProductFound={(p) => setQuery(p.title)} />
        </div>

        {debouncedQuery && debouncedQuery.length >= 3 && (
          <div className="mb-6">
            <ProductSummary productName={debouncedQuery} />
          </div>
        )}

        {/* Category filters */}
        {showFilters && categories && (
          <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Searching..." : `${products?.length || 0} product${(products?.length || 0) !== 1 ? "s" : ""} found`}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear all</button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <LiveProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState onAction={clearFilters} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;
