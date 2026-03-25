import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  useVendorProducts, useVendorProfile, useCreateProduct,
  useToggleOfferVisibility, useUpdateOffer, useUpdateProduct,
  useDeleteProduct, useUploadProductImage
} from "@/hooks/useVendorDashboard";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Package, Plus, Eye, MousePointer, Store, X, Languages,
  Trash2, Pencil, Upload, Mail, Check, ImageIcon, Bell, Users,
  ScanBarcode, Loader2, QrCode, BarChart3, UserCircle, Save
} from "lucide-react";
import { useFoodProductLookup, nutritionGradeConfig } from "@/hooks/useFoodProduct";
import FoundingVendorBanner from "@/components/FoundingVendorBanner";
import TranslationManager from "@/components/vendor/TranslationManager";
import ReferralSection from "@/components/vendor/ReferralSection";
import QRCodeButton from "@/components/QRCodeButton";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatPrice } from "@/utils/currency";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const VendorDashboard = () => {
  const { user, isVendor, vendorId, loading: authLoading } = useAuth();
  const { data: products, isLoading } = useVendorProducts();
  const { data: vendor } = useVendorProfile();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const toggleVisibility = useToggleOfferVisibility();
  const updateOffer = useUpdateOffer();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const uploadImage = useUploadProductImage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [expandedTranslation, setExpandedTranslation] = useState<string | null>(null);
  const [editingOffer, setEditingOffer] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [inStock, setInStock] = useState(true);
  const [shippingDays, setShippingDays] = useState("3");
  const [barcodeInput, setBarcodeInput] = useState("");
  const foodLookup = useFoodProductLookup();

  // Edit state
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState(true);

  // Submission form state
  const [subName, setSubName] = useState("");
  const [subBrand, setSubBrand] = useState("");
  const [subDescription, setSubDescription] = useState("");
  const [subImageUrl, setSubImageUrl] = useState("");
  const [subCategory, setSubCategory] = useState("");

  // Profile edit state
  const [profileBusinessName, setProfileBusinessName] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [profileCountry, setProfileCountry] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [profileWebsite, setProfileWebsite] = useState("");
  const [profileWhatsapp, setProfileWhatsapp] = useState("");
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Fetch vendor's submissions
  const { data: submissions } = useQuery({
    queryKey: ["vendor-submissions", vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const { data, error } = await supabase
        .from("product_submissions")
        .select("*")
        .eq("vendor_id", vendorId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });

  const submitProduct = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("product_submissions").insert({
        vendor_id: vendorId!,
        name: subName,
        brand: subBrand || null,
        description: subDescription || null,
        image_url: subImageUrl || null,
        category: subCategory || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-submissions"] });
      toast({ title: "Product submitted for review!" });
      setShowSubmitForm(false);
      setSubName(""); setSubBrand(""); setSubDescription(""); setSubImageUrl(""); setSubCategory("");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  // Fetch active price alerts for this vendor's products
  const productIds = products?.map((o: any) => o.product_id).filter(Boolean) || [];
  const { data: alertsCount } = useQuery({
    queryKey: ["vendor-alerts-count", productIds],
    queryFn: async () => {
      if (!productIds.length) return 0;
      const { count, error } = await supabase
        .from("price_alerts")
        .select("*", { count: "exact", head: true })
        .in("product_id", productIds)
        .eq("active", true);
      if (error) throw error;
      return count || 0;
    },
    enabled: productIds.length > 0,
  });

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-3 w-full max-w-md px-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-card border border-border rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
  if (!user) return <Navigate to="/auth" />;
  if (!isVendor) return <Navigate to="/" />;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage.mutateAsync(file);
      setImageUrl(url);
      toast({ title: "Image uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setName(""); setBrand(""); setDescription(""); setImageUrl(""); setPrice("");
    setWhatsappMsg(""); setPaymentLink(""); setInStock(true); setShippingDays("3");
    setCategoryId(""); setBarcodeInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync({
        name, brand, description, image_url: imageUrl, category_id: categoryId,
        price: parseFloat(price), currency, whatsapp_message: whatsappMsg, payment_link: paymentLink,
      });
      toast({ title: "Product listed successfully! ✓" });
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (offerId: string, productId: string) => {
    try {
      await deleteProduct.mutateAsync({ offerId, productId });
      toast({ title: "Product deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSaveEdit = async (offerId: string) => {
    try {
      await updateOffer.mutateAsync({
        offerId,
        data: { price: parseFloat(editPrice), in_stock: editStock },
      });
      setEditingOffer(null);
      toast({ title: "Product updated" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (offer: any) => {
    setEditingOffer(offer.id);
    setEditPrice(String(offer.price));
    setEditStock(offer.in_stock ?? true);
  };

  const initProfileEdit = () => {
    if (vendor) {
      setProfileBusinessName(vendor.business_name || "");
      setProfileCity(vendor.city || "");
      setProfileCountry(vendor.country || "");
      setProfileDescription(vendor.description || "");
      setProfileWebsite(vendor.website || "");
      setProfileWhatsapp(vendor.whatsapp_number || "");
      setProfileEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!vendorId) return;
    setProfileSaving(true);
    const { error } = await supabase.from("vendors").update({
      business_name: profileBusinessName,
      city: profileCity,
      country: profileCountry,
      description: profileDescription,
      website: profileWebsite,
      whatsapp_number: profileWhatsapp,
    }).eq("id", vendorId);
    setProfileSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      setProfileEditing(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !vendorId) return;
    try {
      const ext = file.name.split(".").pop();
      const path = `logos/${vendorId}-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      await supabase.from("vendors").update({ logo_url: urlData.publicUrl }).eq("id", vendorId);
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      toast({ title: "Logo updated!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
  };

  const totalViews = products?.reduce((s, o) => s + (o.views || 0), 0) || 0;
  const totalClicks = products?.reduce((s, o) => s + (o.clicks || 0), 0) || 0;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";
  const bestProduct = products?.length
    ? [...products].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]
    : null;

  const chartData = (products || []).slice(0, 10).map((o: any) => ({
    name: o.product?.name?.slice(0, 15) || "–",
    views: o.views || 0,
    clicks: o.clicks || 0,
  }));

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

        <FoundingVendorBanner />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: "Products", value: products?.length || 0 },
            { icon: Eye, label: "Total Views", value: totalViews },
            { icon: MousePointer, label: "Total Clicks", value: totalClicks },
            { icon: Bell, label: "Active Alerts", value: alertsCount ?? 0 },
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

            {/* Barcode Auto-fill */}
            <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
              <Label className="text-xs text-muted-foreground mb-2 block">Auto-fill from barcode (food products)</Label>
              <div className="flex gap-2">
                <Input
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Enter barcode e.g. 7622300489434"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!barcodeInput || foodLookup.isPending}
                  onClick={async () => {
                    const result = await foodLookup.mutateAsync(barcodeInput);
                    if (result) {
                      setName(result.name || name);
                      setBrand(result.brand || brand);
                      setDescription(
                        [result.ingredients && `Ingredients: ${result.ingredients}`, result.quantity && `Quantity: ${result.quantity}`, result.labels && `Labels: ${result.labels}`]
                          .filter(Boolean).join("\n") || description
                      );
                      if (result.imageUrl) setImageUrl(result.imageUrl);
                      toast({ title: "Product info loaded from barcode" });
                    } else {
                      toast({ title: "Product not found", description: "No match in Open Food Facts database", variant: "destructive" });
                    }
                  }}
                >
                  {foodLookup.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanBarcode className="w-4 h-4" />}
                  Lookup
                </Button>
              </div>
              {foodLookup.data && foodLookup.data.nutritionGrade && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Nutrition Grade:</span>
                  <Badge className={nutritionGradeConfig[foodLookup.data.nutritionGrade]?.colorClass || "bg-muted"}>
                    {foodLookup.data.nutritionGrade.toUpperCase()}
                  </Badge>
                </div>
              )}
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
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                  placeholder="Product description..."
                  rows={3}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">{description.length}/1000</p>
              </div>
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadImage.isPending}
                    className="flex-1"
                  >
                    {uploadImage.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : (
                      <><Upload className="w-4 h-4" /> Upload Image</>
                    )}
                  </Button>
                  {imageUrl && (
                    <div className="w-10 h-10 rounded-md overflow-hidden border border-border">
                      <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste image URL" className="mt-1" />
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
                <Label>Shipping Days</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={shippingDays}
                  onChange={(e) => setShippingDays(e.target.value)}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Status</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch checked={inStock} onCheckedChange={setInStock} />
                  <span className="text-sm">{inStock ? "In Stock" : "Out of Stock"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Message</Label>
                <Textarea
                  value={whatsappMsg || `Hi! I'm interested in ${name || "[product name]"}. Is it available?`}
                  onChange={(e) => setWhatsappMsg(e.target.value)}
                  placeholder="Custom buy message"
                  rows={2}
                />
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="products">
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="products"><Package className="w-3 h-3 mr-1" />Products</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="w-3 h-3 mr-1" />Analytics</TabsTrigger>
            <TabsTrigger value="profile"><UserCircle className="w-3 h-3 mr-1" />My Profile</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <h2 className="font-heading font-semibold text-lg mb-4">Your Products ({products?.length || 0})</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-[50px] h-[50px] rounded-lg bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                      </div>
                      <div className="h-6 bg-muted rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !products?.length ? (
              <div className="text-center py-16 bg-card border border-border rounded-xl">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-heading font-semibold">No products yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add your first product to start receiving buyer inquiries</p>
                <Button className="mt-4" onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4" /> Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((offer: any) => (
                  <div key={offer.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {offer.product?.image_url ? (
                        <img src={offer.product.image_url} alt={offer.product?.name} className="w-[50px] h-[50px] rounded-lg object-cover bg-muted shrink-0" />
                      ) : (
                        <div className="w-[50px] h-[50px] rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-semibold text-sm truncate">{offer.product?.name}</h3>
                          {offer.product?.category?.name && (
                            <Badge variant="outline" className="text-[10px]">{offer.product.category.name}</Badge>
                          )}
                          <Badge variant={offer.in_stock ? "default" : "outline"} className={`text-[10px] ${offer.in_stock ? "bg-success text-success-foreground" : ""}`}>
                            {offer.in_stock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{offer.product?.brand}</p>

                        {editingOffer === offer.id ? (
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Input
                              type="number"
                              step="0.01"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-28 h-8 text-sm"
                            />
                            <div className="flex items-center gap-1">
                              <Switch checked={editStock} onCheckedChange={setEditStock} />
                              <span className="text-xs">{editStock ? "In Stock" : "Out"}</span>
                            </div>
                            <Button size="sm" className="h-7" onClick={() => handleSaveEdit(offer.id)}>
                              <Check className="w-3 h-3" /> Save
                            </Button>
                            <Button size="sm" variant="outline" className="h-7" onClick={() => setEditingOffer(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <p className="font-heading font-bold text-lg mt-1">{formatPrice(offer.price, offer.currency)}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {offer.views || 0}</span>
                        <span className="flex items-center gap-1"><MousePointer className="w-3 h-3" /> {offer.clicks || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => startEdit(offer)}>
                          <Pencil className="w-3 h-3" /> Edit
                        </Button>
                        <QRCodeButton
                          url={`${window.location.origin}/product/${offer.product?.slug}`}
                          productName={offer.product?.name || "Product"}
                          size={200}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => setExpandedTranslation(expandedTranslation === offer.product?.id ? null : offer.product?.id)}
                        >
                          <Languages className="w-3 h-3" /> Translate
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove "{offer.product?.name}" from your listings. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(offer.id, offer.product?.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

            {/* Submit New Product Section */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Can't find your product in the catalog?{" "}
                  <button onClick={() => setShowSubmitForm(!showSubmitForm)} className="text-primary hover:underline font-medium">
                    Submit it for review →
                  </button>
                </p>
              </div>

              {showSubmitForm && (
                <div className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold">New Product Submission</h3>
                    <button onClick={() => setShowSubmitForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); submitProduct.mutate(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name *</Label>
                      <Input value={subName} onChange={(e) => setSubName(e.target.value)} required placeholder="e.g. iPhone 15 Pro" />
                    </div>
                    <div className="space-y-2">
                      <Label>Brand (optional)</Label>
                      <Input value={subBrand} onChange={(e) => setSubBrand(e.target.value)} placeholder="e.g. Apple" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Select category</option>
                        {categories?.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL (optional)</Label>
                      <Input value={subImageUrl} onChange={(e) => setSubImageUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description (max 300 chars)</Label>
                      <Textarea value={subDescription} onChange={(e) => setSubDescription(e.target.value.slice(0, 300))} placeholder="Brief product description..." maxLength={300} />
                      <p className="text-xs text-muted-foreground">{subDescription.length}/300</p>
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" disabled={submitProduct.isPending || !subName}>
                        {submitProduct.isPending ? "Submitting..." : "Submit for Review"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {submissions && submissions.length > 0 && (
                <div className="space-y-2">
                  {submissions.map((sub: any) => (
                    <div key={sub.id} className={`bg-card border rounded-xl p-3 flex items-center gap-3 ${
                      sub.status === "pending" ? "border-secondary/50" : sub.status === "approved" ? "border-success/50" : "border-destructive/30"
                    }`}>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{sub.name}</p>
                        <p className="text-xs text-muted-foreground">{sub.brand} {sub.category ? `· ${sub.category}` : ""}</p>
                      </div>
                      <Badge variant={sub.status === "pending" ? "outline" : sub.status === "approved" ? "default" : "destructive"} className="text-xs">
                        {sub.status === "pending" ? "Under Review" : sub.status === "approved" ? "Approved" : "Rejected"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ReferralSection vendorId={vendorId} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Views", value: totalViews },
                  { label: "WhatsApp Clicks", value: totalClicks },
                  { label: "Click-through Rate", value: `${ctr}%` },
                  { label: "Products Listed", value: products?.length || 0 },
                ].map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                    <div className="font-heading text-xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              {bestProduct && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Best performing product</p>
                  <p className="font-heading font-bold">{bestProduct.product?.name}</p>
                  <p className="text-xs text-muted-foreground">{bestProduct.clicks || 0} clicks · {bestProduct.views || 0} views</p>
                </div>
              )}

              {chartData.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="font-heading font-semibold mb-4">Views vs Clicks per Product</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="clicks" fill="hsl(var(--secondary))" name="Clicks" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-lg">My Profile</h2>
                {!profileEditing && (
                  <Button variant="outline" size="sm" onClick={initProfileEdit}>
                    <Pencil className="w-3 h-3" /> Edit
                  </Button>
                )}
              </div>

              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                  {vendor?.logo_url ? (
                    <img src={vendor.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>
                    <Upload className="w-3 h-3" /> Change Logo
                  </Button>
                </div>
              </div>

              {profileEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input value={profileBusinessName} onChange={(e) => setProfileBusinessName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp Number</Label>
                    <Input value={profileWhatsapp} onChange={(e) => setProfileWhatsapp(e.target.value)} placeholder="+233..." />
                    <p className="text-xs text-muted-foreground">Include country code e.g. +233...</p>
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={profileCity} onChange={(e) => setProfileCity(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <select value={profileCountry} onChange={(e) => setProfileCountry(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      {["Ghana", "Nigeria", "Kenya", "South Africa", "Cameroon", "Senegal", "Côte d'Ivoire", "Tanzania", "Uganda", "Rwanda", "Ethiopia"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Business Description</Label>
                    <Textarea
                      value={profileDescription}
                      onChange={(e) => setProfileDescription(e.target.value.slice(0, 300))}
                      placeholder="Tell buyers about your business..."
                      maxLength={300}
                    />
                    <p className="text-xs text-muted-foreground">{profileDescription.length}/300</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Website URL (optional)</Label>
                    <Input value={profileWebsite} onChange={(e) => setProfileWebsite(e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={vendor?.email || user?.email || ""} disabled className="opacity-60" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={profileSaving}>
                      {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setProfileEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Business Name", value: vendor?.business_name },
                    { label: "WhatsApp", value: vendor?.whatsapp_number },
                    { label: "City", value: vendor?.city || "—" },
                    { label: "Country", value: vendor?.country },
                    { label: "Website", value: vendor?.website || "—" },
                    { label: "Email", value: vendor?.email || user?.email },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs text-muted-foreground">{field.label}</p>
                      <p className="font-medium text-sm">{field.value}</p>
                    </div>
                  ))}
                  {vendor?.description && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm">{vendor.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <div className="bg-card border border-border rounded-xl p-4 mt-8 flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Support Contact</p>
            <a href="mailto:nanabenyinq@gmail.com" className="text-sm text-primary hover:underline">nanabenyinq@gmail.com</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VendorDashboard;
