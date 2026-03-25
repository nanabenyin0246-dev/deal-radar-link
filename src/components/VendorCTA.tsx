import { Button } from "@/components/ui/button";
import { ArrowRight, Store, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const VendorCTA = () => {
  const { isVendor } = useAuth();

  if (isVendor) return null;

  return (
    <section id="vendors" className="py-20 bg-background">
      <div className="container">
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
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-2 text-sm text-primary-foreground/90">
                  <Check className="w-4 h-4 shrink-0" /> Free to list
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-foreground/90">
                  <Check className="w-4 h-4 shrink-0" /> Approved in 24h
                </div>
              </div>
              <div className="pt-2">
                <Button variant="hero-outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link to="/auth">
                    Register as Vendor
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorCTA;
