import { UserPlus, Package, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HowToSell = () => {
  const { isVendor, user } = useAuth();
  if (isVendor || user) return null;

  const steps = [
    { icon: UserPlus, title: "Register", desc: "Create a free vendor account in 1 minute" },
    { icon: Package, title: "List Products", desc: "Add your products with photos and prices" },
    { icon: Zap, title: "Get WhatsApp Orders", desc: "Buyers contact you directly via WhatsApp" },
  ];

  return (
    <section className="py-16 bg-accent/30">
      <div className="container max-w-4xl">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-3">
          Start Selling in 3 Steps
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          It's free to list. No monthly fees. No setup costs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary text-primary-foreground font-heading text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-heading font-bold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button size="lg" asChild>
            <Link to="/auth?tab=vendor">
              Start Selling Free <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowToSell;
