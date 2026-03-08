import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import RecentlyViewedSidebar from "@/components/RecentlyViewedSidebar";
import { useProduct } from "@/hooks/useProducts";
import { useProductTranslations } from "@/hooks/useTranslation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Star, ArrowLeft, Truck, ExternalLink, CreditCard, Share2, Copy, Twitter } from "lucide-react";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import ConvertedPrice from "@/components/ConvertedPrice";
import ProductSummary from "@/components/ProductSummary";
import DeliveryWeather from "@/components/DeliveryWeather";
import SEOHead from "@/components/SEOHead";
import { useCreateOrder } from "@/hooks/useOrders";
import { useInitializePayment } from "@/hooks/usePaystack";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/I18nContext";
import { SUPPORTED_LOCALES, Locale } from "@/i18n/translations";
import { formatPrice } from "@/utils/currency";
import VendorBadge from "@/components/VendorBadge";
import PriceAlertButton from "@/components/PriceAlertButton";
import DealScoreBadge from "@/components/DealScoreBadge";

const ProductDetail = () => {
  const { slug, lang } = useParams<{ slug: string; lang?: string }>();
  const { locale, setLocale, t } = useI18n();
  const { data: product, isLoading, error } = useProduct(slug || "");
  const { data: translations } = useProductTranslations(product?.id || "");
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const initPayment = useInitializePayment();
  const { toast } = useToast();
  const { recentProducts, addProduct } = useRecentlyViewed();

  useEffect(() => {
    if (lang && SUPPORTED_LOCALES.some(l => l.code === lang) && lang !== locale) {
      setLocale(lang as Locale);
    }
  }, [lang]);

  const activeTranslation = translations?.find(
    (tr: any) => tr.language_code === locale && tr.approved
  );
  const productName = activeTranslation?.name || product?.name || "";
  const productDescription = activeTranslation?.description || product?.description || "";

  // Track recently viewed - must be before early returns
  const lowestOffer = useMemo(() => {
    if (!product?.vendor_offers) return null;
    const visible = product.vendor_offers.filter((o: any) => o.is_visible);
    return visible.length > 0 ? visible.reduce((a: any, b: any) => a.price < b.price ? a : b) : null;
  }, [product]);

  useEffect(() => {
    if (product && lowestOffer) {
      addProduct({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image_url: product.image_url,
        lowest_price: lowestOffer.price,
        currency: lowestOffer.currency,
      });
    }
  }, [product?.id]);

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
        <div className="container py-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
              <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
              <div className="h-32 bg-muted rounded-xl animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold">{t("detail.notFound")}</h1>
          <p className="text-muted-foreground mt-2">{t("detail.notFoundDesc")}</p>
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

  const avgPrice = offers.length > 0 ? offers.reduce((sum, o) => sum + o.price, 0) / offers.length : 0;
  const cheapest = offers[0];

  const getWhatsAppLink = (offer: typeof offers[0]) => {
    const msg = offer.whatsapp_message ||
      `Hi! I'm interested in ${product.name} for ${formatPrice(offer.price, offer.currency)}. Is it available?`;
    return `https://wa.me/${offer.vendor.whatsapp_number}?text=${encodeURIComponent(msg)}`;
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/placeholder-product.svg";
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: productDescription,
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
        title={`Compare ${productName} prices`}
        description={cheapest ? `Best price: ${formatPrice(cheapest.price, cheapest.currency)} from ${offers.length} vendor${offers.length !== 1 ? "s" : ""}` : `Compare prices for ${productName}`}
        path={`/product/${slug}`}
        image={product.image_url || undefined}
        type="product"
        jsonLd={jsonLd}
      />
      <Navbar />
      <div className="container py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">{t("detail.home")}</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">{t("nav.browse")}</Link>
          <span>/</span>
          <span className="text-foreground truncate">{productName}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="aspect-square bg-muted rounded-xl overflow-hidden">
            <img
              src={product.image_url || "/placeholder-product.svg"}
              alt={productName}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={handleImgError}
            />
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              {product.category && (
                <Badge variant="outline" className="mb-2">{product.category.icon} {product.category.name}</Badge>
              )}
              <h1 className="font-heading text-2xl md:text-3xl font-bold">{productName}</h1>
              {product.brand && <p className="text-muted-foreground mt-1">{product.brand}</p>}

              {/* Share Buttons */}
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({ title: "Link copied!" });
                  }}
                >
                  <Copy className="w-3 h-3" /> Copy Link
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out ${productName} on RobCompare — best price is ${cheapest ? formatPrice(cheapest.price, cheapest.currency) : "N/A"}! ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Compare ${productName} prices on @RobCompare`)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 className="w-3 h-3" /> X
                  </a>
                </Button>
              </div>
            </div>

            {product.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.review_count || 0} {t("detail.reviews")})</span>
              </div>
            )}

            {cheapest && (
              <div className="bg-accent rounded-xl p-4">
                <p className="text-sm text-accent-foreground font-medium">{t("products.bestPrice")}</p>
                <p className="font-heading text-3xl font-bold text-foreground mt-1">
                  {formatPrice(cheapest.price, cheapest.currency)}
                </p>
                <ConvertedPrice amount={cheapest.price} currency={cheapest.currency} className="text-sm" />
                <VendorBadge
                  businessName={cheapest.vendor.business_name}
                  country={cheapest.vendor.country}
                  verified={cheapest.vendor.verified}
                  className="text-sm text-muted-foreground mt-1"
                />
                <div className="flex gap-2 mt-4">
                  <Button variant="whatsapp" className="flex-1" asChild>
                    <a href={getWhatsAppLink(cheapest)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" /> {t("products.buyWhatsapp")}
                    </a>
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handlePaystackPay(cheapest)}
                    disabled={createOrder.isPending || initPayment.isPending}
                  >
                    <CreditCard className="w-4 h-4" />
                    {createOrder.isPending || initPayment.isPending ? t("common.loading") : t("detail.payOnline")}
                  </Button>
                </div>
                <div className="mt-3">
                  <PriceAlertButton productId={product.id} currentPrice={cheapest.price} currency={cheapest.currency} />
                </div>
              </div>
            )}

            {productDescription && (
              <div>
                <h3 className="font-heading font-semibold mb-2">{t("detail.description")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{productDescription}</p>
              </div>
            )}
          </div>
        </div>

        {/* DuckDuckGo Product Summary */}
        <div className="mb-8">
          <ProductSummary productName={productName} brand={product.brand || undefined} />
        </div>

        {/* Price History Chart */}
        <div className="mb-12">
          <PriceHistoryChart productId={product.id} currency={cheapest?.currency} />
        </div>

        {/* Vendor Comparison Table */}
        {offers.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-xl font-bold mb-4">
              {t("detail.compareVendors").replace("{count}", String(offers.length)).replace("{plural}", offers.length > 1 ? "s" : "")}
            </h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 font-medium text-muted-foreground">{t("detail.vendor")}</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">{t("detail.price")}</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">{t("detail.trust")}</th>
                       <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">{t("detail.shipping")}</th>
                       <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">{t("detail.stock")}</th>
                       <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Deal</th>
                       <th className="text-right p-4 font-medium text-muted-foreground">{t("detail.action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((offer, i) => (
                      <tr key={offer.id} className={`border-b border-border last:border-0 ${i === 0 ? "bg-accent/30" : ""}`}>
                        <td className="p-4">
                          <VendorBadge
                            businessName={offer.vendor.business_name}
                            country={offer.vendor.country}
                            verified={offer.vendor.verified}
                            className="font-medium"
                          />
                        </td>
                        <td className="p-4">
                          <p className={`font-heading font-bold ${i === 0 ? "text-primary" : ""}`}>
                            {formatPrice(offer.price, offer.currency)}
                          </p>
                          <ConvertedPrice amount={offer.price} currency={offer.currency} />
                          {i === 0 && <Badge className="bg-secondary text-secondary-foreground text-[10px] mt-1">{t("detail.lowest")}</Badge>}
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
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Truck className="w-3 h-3" />
                              <span>{offer.shipping_days || 3} {t("detail.days")}</span>
                            </div>
                            <DeliveryWeather shippingDays={offer.shipping_days || 3} />
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge variant={offer.in_stock ? "default" : "outline"} className={offer.in_stock ? "bg-success text-success-foreground" : ""}>
                            {offer.in_stock ? t("products.inStock") : t("products.outOfStock")}
                          </Badge>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <DealScoreBadge
                            price={offer.price}
                            averagePrice={avgPrice}
                            vendorVerified={offer.vendor.verified || false}
                            updatedAt={offer.updated_at}
                            showScore
                          />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePaystackPay(offer)}
                              disabled={createOrder.isPending || initPayment.isPending}
                            >
                              <CreditCard className="w-3 h-3" /> {t("detail.pay")}
                            </Button>
                            <Button variant="whatsapp" size="sm" asChild>
                              <a href={getWhatsAppLink(offer)} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="w-3 h-3" /> {t("detail.buy")}
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
