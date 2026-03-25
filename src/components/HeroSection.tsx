import { ArrowRight } from "lucide-react";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/hooks/useProducts";

// Animated counter hook
const useCountUp = (end: number, duration = 1500) => {
  const [count, setCount] = useState(0);
  const prevEnd = useRef(0);

  useEffect(() => {
    if (end === prevEnd.current) return;
    prevEnd.current = end;
    const start = 0;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

const CATEGORY_ICON_MAP: Record<string, string> = {
  electronics: "📱", fashion: "👗", food: "🛒", beauty: "💄", home: "🏠", auto: "🚗",
};

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useI18n();

  // Live stats
  const { data: productCount } = useQuery({
    queryKey: ["products-count"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_products_count");
      if (error) throw error;
      return data as number;
    },
  });
  const { data: vendorCount } = useQuery({
    queryKey: ["vendor-count-live"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_vendor_count");
      if (error) throw error;
      return data as number;
    },
  });
  const { data: countryCount } = useQuery({
    queryKey: ["country-count-live"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_country_count");
      if (error) throw error;
      return data as number;
    },
  });

  const animProducts = useCountUp(productCount || 0);
  const animVendors = useCountUp(vendorCount || 0);
  const animCountries = useCountUp(countryCount || 0);

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
            {t("hero.badge")}
          </div>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight animate-slide-up">
            {t("hero.titleStart")}<span className="text-gradient">{t("hero.titleHighlight")}</span>{t("hero.titleEnd")}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {t("hero.subtitle")}
          </p>

          <form onSubmit={handleSearch} className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center max-w-xl mx-auto bg-card border border-border rounded-xl shadow-lg shadow-primary/5 p-1.5">
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={() => handleSearch({ preventDefault: () => {} } as React.FormEvent)}
                placeholder={t("hero.searchPlaceholder")}
              />
              <Button type="submit" size="lg" className="shrink-0">
                {t("hero.cta")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {CATEGORY_CHIPS.map((chip) => (
              <button
                key={chip.slug}
                onClick={() => navigate(`/products?category=${chip.slug}`)}
                className="px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <span>{t("hero.popular")}</span>
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

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-6 mt-20 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
          {[
            { value: animProducts, suffix: "+", label: t("hero.statProducts") },
            { value: animVendors, suffix: "+", label: t("hero.statVendors") },
            { value: animCountries, suffix: "+", label: t("hero.statCountries") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
