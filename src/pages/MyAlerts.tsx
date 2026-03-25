import { useAuth } from "@/contexts/AuthContext";
import { usePriceAlerts, useDeletePriceAlert } from "@/hooks/usePriceAlerts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Bell, BellOff } from "lucide-react";
import { formatPrice } from "@/utils/currency";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import EmptyState from "@/components/EmptyState";

const MyAlerts = () => {
  const { user } = useAuth();
  const { data: alerts, isLoading } = usePriceAlerts(user?.id);
  const deleteAlert = useDeletePriceAlert();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteAlert.mutateAsync({ id, userId: user.id });
      toast({ title: "Alert removed ✓" });
    } catch {
      toast({ title: "Something went wrong. Try again.", variant: "destructive" });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold">Sign in to view your alerts</h1>
          <Button asChild className="mt-4"><Link to="/auth">Sign In</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-2xl">
        <h1 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6" /> My Price Alerts
        </h1>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !alerts?.length ? (
          <EmptyState
            icon={<BellOff className="w-8 h-8 text-muted-foreground" />}
            title="No alerts yet"
            description="Set a price alert on any product to get notified when the price drops."
            actionLabel="Browse Products"
            onAction={() => window.location.href = "/products"}
          />
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                {/* Product image */}
                <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                  <img
                    src={alert.product?.image_url || "/placeholder-product.svg"}
                    alt={alert.product?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "/placeholder-product.svg"; }}
                  />
                </div>
                {/* Alert details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${alert.product?.slug}`} className="hover:text-primary transition-colors">
                    <p className="font-heading font-semibold text-sm truncate">
                      {alert.product?.name || "Product"}
                    </p>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Alert when price drops below <strong className="text-foreground">{formatPrice(alert.target_price, alert.currency)}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Set {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </div>
                {/* Status + actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant={alert.active ? "default" : "outline"} className={alert.active ? "bg-success text-success-foreground text-xs" : "text-xs"}>
                    {alert.active ? "Active" : "Triggered"}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(alert.id)} disabled={deleteAlert.isPending}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyAlerts;
