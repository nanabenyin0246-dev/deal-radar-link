import { useAuth } from "@/contexts/AuthContext";
import { useWishlistProducts } from "@/hooks/useWishlist";
import LiveProductCard from "@/components/LiveProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const SavedProducts = () => {
  const { user } = useAuth();
  const { data: products, isLoading } = useWishlistProducts(user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold">Sign in to view saved products</h1>
          <Button asChild className="mt-4"><Link to="/auth">Sign In</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Saved Products" description="Your saved products on RobCompare" path="/saved" />
      <Navbar />
      <div className="container py-8">
        <h1 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" /> Saved Products
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
          </div>
        ) : !products?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-heading text-lg font-semibold">No saved products yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Tap ♥ on any product to save it here</p>
            <Button asChild className="mt-4"><Link to="/products">Browse Products</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <LiveProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SavedProducts;
