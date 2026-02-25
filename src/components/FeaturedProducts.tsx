import { mockProducts } from "@/data/mockProducts";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Trending Deals</h2>
            <p className="text-muted-foreground mt-1 text-sm">Best prices found by our AI this week</p>
          </div>
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link to="/products">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link to="/products">View All Products <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
