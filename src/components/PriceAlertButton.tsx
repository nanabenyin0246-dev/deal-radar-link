import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useCreatePriceAlert } from "@/hooks/usePriceAlerts";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/currency";

interface PriceAlertButtonProps {
  productId: string;
  currentPrice?: number;
  currency?: string;
}

const PriceAlertButton = ({ productId, currentPrice, currency = "GHS" }: PriceAlertButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createAlert = useCreatePriceAlert();
  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(
    currentPrice ? Math.round(currentPrice * 0.9).toString() : ""
  );

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to set price alerts.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (!price || price <= 0) return;

    try {
      await createAlert.mutateAsync({
        user_id: user!.id,
        product_id: productId,
        target_price: price,
        currency,
      });
      toast({ title: "Alert created ✓", description: `We'll notify you when the price drops below ${formatPrice(price, currency)}.` });
      setOpen(false);
    } catch {
      toast({ title: "Something went wrong", description: "Try again.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={handleClick} className="gap-1.5">
        <Bell className="w-4 h-4" /> Notify me
      </Button>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentPrice && (
            <p className="text-sm text-muted-foreground">
              Current best price: <strong>{formatPrice(currentPrice, currency)}</strong>
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="target-price">Alert me when price drops below</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{currency}</span>
              <Input
                id="target-price"
                type="number"
                step="0.01"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Enter target price"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={createAlert.isPending}>
            {createAlert.isPending ? "Saving..." : "Set Alert"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PriceAlertButton;
