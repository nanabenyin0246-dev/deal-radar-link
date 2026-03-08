import { Link } from "react-router-dom";
import { RecentProduct } from "@/hooks/useRecentlyViewed";
import { Clock } from "lucide-react";

interface RecentlyViewedSidebarProps {
  products: RecentProduct[];
  currentProductId: string;
}

const RecentlyViewedSidebar = ({ products, currentProductId }: RecentlyViewedSidebarProps) => {
  const filtered = products.filter((p) => p.id !== currentProductId).slice(0, 3);

  if (filtered.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-['Space_Grotesk'] text-sm font-bold text-foreground">
          You recently viewed
        </h3>
      </div>
      <div className="space-y-3">
        {filtered.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
              <img
                src={product.image_url || "/placeholder-product.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = "/placeholder-product.svg"; }}
              />
            </div>
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
              {product.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedSidebar;
