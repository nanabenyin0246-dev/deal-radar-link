import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Shield, MapPin, ExternalLink, Copy } from "lucide-react";
import { formatPrice } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";
import QRCodeButton from "@/components/QRCodeButton";
import { Progress } from "@/components/ui/progress";

const VendorStorefront = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { toast } = useToast();

  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ["storefront-vendor", vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", vendorId!)
        .eq("status", "approved")
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });

  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ["storefront-offers", vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendor_offers")
        .select("*, product:products(*, category:categories(name, icon))")
        .eq("vendor_id", vendorId!)
        .eq("is_visible", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!vendorId,
  });

  const isLoading = vendorLoading || offersLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 max-w-4xl">
          <div className="h-40 bg-muted rounded-xl animate-pulse mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold">Vendor not found</h1>
          <p className="text-muted-foreground mt-2">This store may not exist or is not yet approved.</p>
          <Button asChild className="mt-4"><Link to="/products">Browse Products</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/placeholder-product.svg";
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${vendor.business_name} — Shop on RobCompare`}
        description={`Compare prices from ${vendor.business_name} in ${vendor.city || ""}, ${vendor.country}. ${(offers || []).length} products available.`}
        path={`/store/${vendorId}`}
      />
      <Navbar />
      <div className="container py-8 max-w-4xl">
        {/* Vendor Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border shrink-0">
              {vendor.logo_url ? (
                <img src={vendor.logo_url} alt={vendor.business_name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-heading text-2xl font-bold text-muted-foreground">
                  {vendor.business_name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
                {vendor.business_name}
                {vendor.verified && <Shield className="w-5 h-5 text-primary" />}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {vendor.city ? `${vendor.city}, ` : ""}{vendor.country}
              </p>
              {vendor.trust_score && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">Trust Score:</span>
                  <Progress value={vendor.trust_score} className="w-24 h-2" />
                  <span className="text-xs font-medium">{vendor.trust_score}%</span>
                </div>
              )}
              {vendor.description && (
                <p className="text-sm text-muted-foreground mt-2">{vendor.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Button variant="whatsapp" size="sm" asChild>
                  <a href={`https://wa.me/${vendor.whatsapp_number}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" /> Contact on WhatsApp
                  </a>
                </Button>
                {vendor.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" /> Website
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({ title: "Store link copied!" });
                }}>
                  <Copy className="w-3.5 h-3.5" /> Share Store
                </Button>
                <QRCodeButton url={window.location.href} productName={vendor.business_name} />
                <Badge variant="outline">{(offers || []).length} Products Listed</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {!offers?.length ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products listed yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {offers.map((offer: any) => (
              <Link key={offer.id} to={`/product/${offer.product?.slug}`} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all">
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={offer.product?.image_url || "/placeholder-product.svg"}
                    alt={offer.product?.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={handleImgError}
                  />
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">{offer.product?.category?.icon} {offer.product?.category?.name}</p>
                  <h3 className="font-heading font-semibold text-sm line-clamp-2">{offer.product?.name}</h3>
                  <p className="font-heading text-lg font-bold text-primary">{formatPrice(offer.price, offer.currency)}</p>
                  {offer.in_stock === false && <Badge variant="outline" className="text-[10px]">Out of stock</Badge>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VendorStorefront;
