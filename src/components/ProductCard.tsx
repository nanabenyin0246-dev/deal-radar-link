import { MessageCircle, Shield, Star } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/currency";

const ProductCard = ({ product }: { product: Product }) => {
  const cheapest = product.vendors.reduce((a, b) => a.price < b.price ? a : b);
  const mostExpensive = product.vendors.length > 1
    ? product.vendors.reduce((a, b) => a.price > b.price ? a : b)
    : null;

  const savings = mostExpensive && cheapest.currency === mostExpensive.currency
    ? Math.round(((mostExpensive.price - cheapest.price) / mostExpensive.price) * 100)
    : null;

  const whatsappLink = `https://wa.me/${cheapest.whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'm interested in ${product.name} for ${formatPrice(cheapest.price, cheapest.currency)}. Is it available?`
  )}`;

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/placeholder-product.svg";
  };

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 min-w-0">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={handleImgError}
        />
        {savings && savings > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-secondary text-secondary-foreground font-semibold text-xs">
              Save {savings}%
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-card/80 backdrop-blur-sm text-xs">
            {product.vendors.length} vendor{product.vendors.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3 min-w-0">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-medium truncate">{product.brand} · {product.category}</p>
          <h3 className="font-heading font-semibold text-foreground mt-1 leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-secondary text-secondary shrink-0" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="flex flex-col [@media(min-width:375px)]:flex-row [@media(min-width:375px)]:items-end [@media(min-width:375px)]:justify-between gap-1">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Best price from</p>
            <p className="font-heading text-xl font-bold text-foreground truncate">
              {formatPrice(cheapest.price, cheapest.currency)}
            </p>
            <div className="flex items-center gap-1 mt-0.5 min-w-0">
              {cheapest.verified && <Shield className="w-3 h-3 text-primary shrink-0" />}
              <span className="text-xs text-muted-foreground truncate">{cheapest.vendorName}</span>
            </div>
          </div>
        </div>

        <Button variant="whatsapp" className="w-full" asChild>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4" />
            Buy on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
