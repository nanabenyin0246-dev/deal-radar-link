import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Shield, Star, ArrowLeft, Truck, ExternalLink, CreditCard } from "lucide-react";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import SEOHead from "@/components/SEOHead";
import { useCreateOrder } from "@/hooks/useOrders";
import { useInitializePayment } from "@/hooks/usePaystack";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || "");
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const initPayment = useInitializePayment();
  const { toast } = useToast();

  const handlePaystackPay = async (offer: any) => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to pay online.", variant: "destructive" });
      return;
    }
    try {
      const order = await createOrder.mutateAsync({
        vendor_offer_id: offer.id,
        vendor_id: offer.vendor.id,
        product_id: product!.id,
        unit_price: offer.price,
        currency: offer.currency,
        payment_method: "paystack",
      });
      const payment = await initPayment.mutateAsync(order.id);
      window.location.href = payment.authorization_url;
    } catch (err: any) {
      toast({ title: "Payment Error", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold">Product not found</h1>
          <p className="text-muted-foreground mt-2">This product may have been removed or doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link to="/products"><ArrowLeft className="w-4 h-4" /> Browse Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const offers = (product.vendor_offers || [])
    .filter((o) => o.is_visible)
    .sort((a, b) => a.price - b.price);

  const cheapest = offers[0];

  const getWhatsAppLink = (offer: typeof offers[0]) => {
    const msg = offer.whatsapp_message ||
      `Hi! I'm interested in ${product.name} for ${offer.currency} ${offer.price.toLocaleString()}. Is it available?`;
    return `https://wa.me/${offer.vendor.whatsapp_number}?text=${encodeURIComponent(msg)}`;
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_url,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    aggregateRating: product.rating ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.review_count || 0,
    } : undefined,
    offers: offers.map((o) => ({
      "@type": "Offer",
      price: o.price,
      priceCurrency: o.currency,
      availability: o.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: o.vendor.business_name },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={product.name}
        description={product.description || `Compare prices for ${product.name} from ${offers.length} vendors`}
        path={`/product/${slug}`}
        image={product.image_url || undefined}
        type="product"
        jsonLd={jsonLd}
      />
      <Navbar />
      <div className="container py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="aspect-square bg-muted rounded-xl overflow-hidden">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              {product.category && (
                <Badge variant="outline" className="mb-2">{product.category.icon} {product.category.name}</Badge>
              )}
              <h1 className="font-heading text-2xl md:text-3xl font-bold">{product.name}</h1>
              {product.brand && <p className="text-muted-foreground mt-1">{product.brand}</p>}
            </div>

            {product.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.review_count || 0} reviews)</span>
              </div>
            )}

            {cheapest && (
              <div className="bg-accent rounded-xl p-4">
                <p className="text-sm text-accent-foreground font-medium">Best Price</p>
                <p className="font-heading text-3xl font-bold text-foreground mt-1">
                  {cheapest.currency} {cheapest.price.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {cheapest.vendor.verified && <Shield className="w-3 h-3 text-primary" />}
                  <span className="text-sm text-muted-foreground">from {cheapest.vendor.business_name}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="whatsapp" className="flex-1" asChild>
                    <a href={getWhatsAppLink(cheapest)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" /> Buy on WhatsApp
                    </a>
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handlePaystackPay(cheapest)}
                    disabled={createOrder.isPending || initPayment.isPending}
                  >
                    <CreditCard className="w-4 h-4" />
                    {createOrder.isPending || initPayment.isPending ? "Processing..." : "Pay Online"}
                  </Button>
                </div>
              </div>
            )}

            {product.description && (
              <div>
                <h3 className="font-heading font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Price History Chart */}
        <div className="mb-12">
          <PriceHistoryChart productId={product.id} currency={cheapest?.currency} />
        </div>

        {/* Vendor Comparison Table */}
        {offers.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-xl font-bold mb-4">
              Compare {offers.length} Vendor{offers.length > 1 ? "s" : ""}
            </h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 font-medium text-muted-foreground">Vendor</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Trust</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Shipping</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Stock</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((offer, i) => (
                      <tr key={offer.id} className={`border-b border-border last:border-0 ${i === 0 ? "bg-accent/30" : ""}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {offer.vendor.verified && <Shield className="w-3.5 h-3.5 text-primary shrink-0" />}
                            <div>
                              <p className="font-medium">{offer.vendor.business_name}</p>
                              <p className="text-xs text-muted-foreground">{offer.vendor.country}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className={`font-heading font-bold ${i === 0 ? "text-primary" : ""}`}>
                            {offer.currency} {offer.price.toLocaleString()}
                          </p>
                          {i === 0 && <Badge className="bg-secondary text-secondary-foreground text-[10px] mt-1">Lowest</Badge>}
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <div className="w-8 h-2 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${offer.vendor.trust_score || 50}%` }} />
                            </div>
                            <span className="text-xs">{offer.vendor.trust_score || 50}%</span>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Truck className="w-3 h-3" />
                            <span>{offer.shipping_days || 3} days</span>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge variant={offer.in_stock ? "default" : "outline"} className={offer.in_stock ? "bg-success text-success-foreground" : ""}>
                            {offer.in_stock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePaystackPay(offer)}
                              disabled={createOrder.isPending || initPayment.isPending}
                            >
                              <CreditCard className="w-3 h-3" /> Pay
                            </Button>
                            <Button variant="whatsapp" size="sm" asChild>
                              <a href={getWhatsAppLink(offer)} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="w-3 h-3" /> Buy
                              </a>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
