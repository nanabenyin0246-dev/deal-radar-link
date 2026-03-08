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
              <div
                key={alert.id}
                className="flex items-center justify-between bg-card border border-border rounded-xl p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">Product ID: {alert.product_id.slice(0, 8)}…</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      Target: <strong>{formatPrice(alert.target_price, alert.currency)}</strong>
                    </span>
                    <Badge variant={alert.active ? "default" : "outline"} className={alert.active ? "bg-success text-success-foreground" : ""}>
                      {alert.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(alert.id)}
                  disabled={deleteAlert.isPending}
                  className="text-destructive hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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
