import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBuyerOrders, useCreateDispute } from "@/hooks/useOrders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  AlertTriangle,
  MessageCircle,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBag,
  X,
} from "lucide-react";

const statusConfig: Record<string, { icon: typeof Clock; label: string; className: string }> = {
  pending: { icon: Clock, label: "Pending", className: "bg-muted text-muted-foreground" },
  paid: { icon: CheckCircle2, label: "Paid", className: "bg-primary/10 text-primary" },
  shipped: { icon: Truck, label: "Shipped", className: "bg-secondary/10 text-secondary" },
  delivered: { icon: Package, label: "Delivered", className: "bg-accent text-accent-foreground" },
  completed: { icon: CheckCircle2, label: "Completed", className: "bg-success/10 text-success" },
  disputed: { icon: AlertTriangle, label: "Disputed", className: "bg-destructive/10 text-destructive" },
  refunded: { icon: XCircle, label: "Refunded", className: "bg-muted text-muted-foreground" },
  cancelled: { icon: XCircle, label: "Cancelled", className: "bg-muted text-muted-foreground" },
};

const BuyerOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading } = useBuyerOrders();
  const createDispute = useCreateDispute();
  const { toast } = useToast();
  const [disputeOrderId, setDisputeOrderId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/auth" />;

  const handleDispute = async () => {
    if (!disputeOrderId || !disputeReason) return;
    try {
      await createDispute.mutateAsync({
        order_id: disputeOrderId,
        reason: disputeReason,
        description: disputeDescription,
      });
      toast({ title: "Dispute opened", description: "We'll review your case shortly." });
      setDisputeOrderId(null);
      setDisputeReason("");
      setDisputeDescription("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" /> My Orders
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {orders?.length || 0} order{(orders?.length || 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>

        {/* Dispute Modal */}
        {disputeOrderId && (
          <div className="bg-card border border-destructive/30 rounded-xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" /> Open Dispute
              </h2>
              <button onClick={() => setDisputeOrderId(null)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reason *</Label>
                <Input
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="e.g. Item not received, Wrong item, Damaged"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="Provide details about your issue..."
                  rows={3}
                />
              </div>
              <Button
                variant="destructive"
                onClick={handleDispute}
                disabled={!disputeReason || createDispute.isPending}
              >
                {createDispute.isPending ? "Submitting..." : "Submit Dispute"}
              </Button>
            </div>
          </div>
        )}

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : !orders?.length ? (
          <div className="text-center py-20 bg-card border border-border rounded-xl">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-heading font-semibold text-lg">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Browse products and place your first order
            </p>
            <Button className="mt-4" asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-primary/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    {order.product?.image_url && (
                      <Link to={`/product/${order.product.slug}`} className="shrink-0">
                        <img
                          src={order.product.image_url}
                          alt={order.product.name}
                          className="w-full sm:w-20 h-32 sm:h-20 rounded-lg object-cover bg-muted"
                        />
                      </Link>
                    )}

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            to={`/product/${order.product?.slug}`}
                            className="font-heading font-semibold hover:text-primary transition-colors line-clamp-1"
                          >
                            {order.product?.name || "Product"}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            from {order.vendor?.business_name || "Vendor"}
                          </p>
                        </div>
                        <Badge className={`shrink-0 ${config.className}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm">
                        <span className="font-heading font-bold text-lg">
                          {order.currency} {Number(order.total_price).toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(order.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-muted-foreground text-xs font-mono">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {order.vendor?.whatsapp_number && (
                          <Button variant="whatsapp" size="sm" asChild>
                            <a
                              href={`https://wa.me/${order.vendor.whatsapp_number}?text=${encodeURIComponent(
                                `Hi! I have a question about my order #${order.id.slice(0, 8).toUpperCase()} for ${order.product?.name}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="w-3 h-3" /> Contact Vendor
                            </a>
                          </Button>
                        )}
                        {!["disputed", "refunded", "cancelled", "completed"].includes(order.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDisputeOrderId(order.id)}
                          >
                            <AlertTriangle className="w-3 h-3" /> Open Dispute
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BuyerOrders;
