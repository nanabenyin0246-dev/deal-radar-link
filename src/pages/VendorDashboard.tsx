import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useVendorProducts, useVendorProfile, useCreateProduct, useToggleOfferVisibility, useUpdateOffer } from "@/hooks/useVendorDashboard";
import { useCategories } from "@/hooks/useProducts";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Eye, MousePointer, Store, MessageCircle, X, Languages } from "lucide-react";
import FoundingVendorBanner from "@/components/FoundingVendorBanner";
import TranslationManager from "@/components/vendor/TranslationManager";

const VendorDashboard = () => {
  const { user, isVendor, vendorId, loading: authLoading } = useAuth();
  const { data: products, isLoading } = useVendorProducts();
  const { data: vendor } = useVendorProfile();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const toggleVisibility = useToggleOfferVisibility();
  const updateOffer = useUpdateOffer();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [expandedTranslation, setExpandedTranslation] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("GHS");
  const [whatsappMsg, setWhatsappMsg] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/auth" />;
  if (!isVendor) return <Navigate to="/" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync({
        name, brand, description, image_url: imageUrl, category_id: categoryId,
        price: parseFloat(price), currency, whatsapp_message: whatsappMsg, payment_link: paymentLink,
      });
      toast({ title: "Product created!" });
      setShowForm(false);
      setName(""); setBrand(""); setDescription(""); setImageUrl(""); setPrice(""); setWhatsappMsg(""); setPaymentLink("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const totalViews = products?.reduce((s, o) => s + (o.views || 0), 0) || 0;
  const totalClicks = products?.reduce((s, o) => s + (o.clicks || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Store className="w-6 h-6 text-primary" /> {vendor?.business_name || "Vendor Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {vendor?.status === "approved" ? (
                <Badge className="bg-success text-success-foreground">Approved</Badge>
              ) : (
                <Badge variant="outline">Pending Approval</Badge>
              )}
              {vendor?.verified && <Badge className="ml-2 bg-primary text-primary-foreground">Verified</Badge>}
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        {/* Founding Vendor Banner */}
        <FoundingVendorBanner />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Package, label: "Products", value: products?.length || 0 },
            { icon: Eye, label: "Total Views", value: totalViews },
            { icon: MousePointer, label: "Total Clicks", value: totalClicks },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <s.icon className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
              <div className="font-heading text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg">Add New Product</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Samsung Galaxy A54" />
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Samsung" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..." />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select category</option>
                  {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Price *</Label>
                <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {["GHS", "NGN", "KES", "USD", "EUR", "GBP", "ZAR", "XOF"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Message (optional)</Label>
                <Input value={whatsappMsg} onChange={(e) => setWhatsappMsg(e.target.value)} placeholder="Custom buy message" />
              </div>
              <div className="space-y-2">
                <Label>Payment Link (optional)</Label>
                <Input value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="https://paystack.com/pay/..." />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={createProduct.isPending} className="w-full md:w-auto">
                  {createProduct.isPending ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Product List */}
        <h2 className="font-heading font-semibold text-lg mb-4">Your Products</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : !products?.length ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-heading font-semibold">No products yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first product to start selling</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((offer: any) => (
              <div key={offer.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {offer.product?.image_url && (
                    <img src={offer.product.image_url} alt={offer.product?.name} className="w-16 h-16 rounded-lg object-cover bg-muted" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-sm truncate">{offer.product?.name}</h3>
                    <p className="text-xs text-muted-foreground">{offer.product?.brand} · {offer.product?.category?.name}</p>
                    <p className="font-heading font-bold text-lg mt-1">{offer.currency} {offer.price?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {offer.views || 0}</span>
                    <span className="flex items-center gap-1"><MousePointer className="w-3 h-3" /> {offer.clicks || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => setExpandedTranslation(expandedTranslation === offer.product?.id ? null : offer.product?.id)}
                    >
                      <Languages className="w-3 h-3" /> Translations
                    </Button>
                    <Switch
                      checked={offer.is_visible}
                      onCheckedChange={(v) => toggleVisibility.mutate({ offerId: offer.id, visible: v })}
                    />
                    <span className="text-xs text-muted-foreground">{offer.is_visible ? "Visible" : "Hidden"}</span>
                  </div>
                </div>
                {expandedTranslation === offer.product?.id && offer.product?.id && (
                  <TranslationManager productId={offer.product.id} productName={offer.product.name} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VendorDashboard;
