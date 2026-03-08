import { Link } from "react-router-dom";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Clock, X } from "lucide-react";
import { formatPrice } from "@/utils/currency";

const RecentlyViewedSection = () => {
  const { recentProducts, clearAll } = useRecentlyViewed();

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-8 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-['Space_Grotesk'] text-lg font-bold text-foreground">
              Recently Viewed
            </h2>
          </div>
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear history
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {recentProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="shrink-0 w-40 group"
            >
              <div className="aspect-square rounded-xl bg-muted overflow-hidden border border-border group-hover:border-primary/30 transition-colors">
                <img
                  src={product.image_url || "/placeholder-product.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = "/placeholder-product.svg"; }}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {product.name}
              </p>
              <p className="text-xs font-['Space_Grotesk'] font-bold text-primary">
                {formatPrice(product.lowest_price, product.currency)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
