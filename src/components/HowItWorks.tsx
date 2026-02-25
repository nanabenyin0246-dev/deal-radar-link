import { Search, MessageCircle, TrendingDown, Shield, Globe, Zap } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Any Product",
    description: "Type what you're looking for. Our AI finds matching products from thousands of vendors.",
  },
  {
    icon: TrendingDown,
    title: "Compare Best Prices",
    description: "See prices from multiple vendors side-by-side, sorted by the cheapest option.",
  },
  {
    icon: MessageCircle,
    title: "Buy via WhatsApp",
    description: "Tap 'Buy on WhatsApp' to chat directly with the vendor and complete your purchase.",
  },
];

const features = [
  { icon: Shield, title: "Verified Vendors", description: "Trusted sellers with ratings and reviews" },
  { icon: Globe, title: "Multi-Country", description: "Compare prices across Africa and beyond" },
  { icon: Zap, title: "AI-Powered", description: "Smart matching finds the best deals for you" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="font-heading text-2xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Three simple steps to find the best deals anywhere
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
          {steps.map((step, i) => (
            <div key={step.title} className="relative text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <h3 className="font-heading font-semibold text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
              <f.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-foreground">{f.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
