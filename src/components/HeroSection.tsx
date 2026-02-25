import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            AI-Powered Price Comparison Across Africa & Beyond
          </div>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight animate-slide-up">
            Find the <span className="text-gradient">Best Prices</span> from Trusted Vendors
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Compare prices from thousands of vendors across Africa. Buy instantly via WhatsApp. Save money on every purchase.
          </p>

          <form onSubmit={handleSearch} className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center max-w-xl mx-auto bg-card border border-border rounded-xl shadow-lg shadow-primary/5 p-1.5">
              <Search className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search for any product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
              />
              <Button type="submit" size="lg" className="shrink-0">
                Compare Prices
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <span>Popular:</span>
            {["iPhone 15", "Nike Air Max", "Samsung TV", "Shea Butter"].map((term) => (
              <button
                key={term}
                onClick={() => { setSearchQuery(term); navigate(`/products?q=${encodeURIComponent(term)}`); }}
                className="hover:text-primary transition-colors underline underline-offset-2 decoration-border hover:decoration-primary"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
          {[
            { value: "10K+", label: "Products" },
            { value: "2,500+", label: "Vendors" },
            { value: "15+", label: "Countries" },
            { value: "₵0", label: "Platform Fee" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
