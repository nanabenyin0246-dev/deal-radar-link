import { Button } from "@/components/ui/button";
import { ArrowRight, Store, PartyPopper } from "lucide-react";
import { Link } from "react-router-dom";
import { useCommissionConfig } from "@/hooks/useCommissionConfig";
import { useAuth } from "@/contexts/AuthContext";

const VendorCTA = () => {
  const { data: config } = useCommissionConfig();
  const { isVendor } = useAuth();

  // Hide entire CTA if user is already a vendor
  if (isVendor) return null;
  const isGrowthMode = !config?.commission_active;
  const commissionLabel = isGrowthMode ? "0%" : `${(Number(config?.commission_rate || 0.03) * 100).toFixed(0)}%`;

  return (
    <section id="vendors" className="py-20 bg-background">
      <div className="container">
        {isGrowthMode && (
          <div className="max-w-4xl mx-auto mb-4 bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20 rounded-xl p-4 text-center">
            <p className="font-heading font-bold text-sm flex items-center justify-center gap-2">
              <PartyPopper className="w-4 h-4 text-secondary" />
              🎉 Founding Vendor Program – 0% Commission Until 1,000 Users
            </p>
            <p className="text-xs text-muted-foreground mt-1">Join now and keep 100% of your revenue!</p>
          </div>
        )}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-14 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }} />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">
                Sell on RobCompare
              </h2>
              <p className="text-primary-foreground/80 max-w-md">
                Reach millions of buyers across Africa. List your products for free, receive orders via WhatsApp, and grow your business.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="hero-outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link to="/auth">
                    Register as Vendor
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center shrink-0">
              {[
                { value: "Free", label: "To List" },
                { value: commissionLabel, label: "Commission" },
                { value: "24h", label: "Approval" },
                { value: "0", label: "Monthly Fee" },
              ].map((s) => (
                <div key={s.label} className="bg-primary-foreground/10 rounded-xl p-4">
                  <div className="font-heading text-xl font-bold">{s.value}</div>
                  <div className="text-xs text-primary-foreground/70 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorCTA;
