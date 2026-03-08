import { ArrowRight } from "lucide-react";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { useCommissionConfig, useUserCount } from "@/hooks/useCommissionConfig";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { PartyPopper } from "lucide-react";

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
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data: config } = useCommissionConfig();
  const { data: userCount } = useUserCount();

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

  const showBanner = config && !config.commission_active;
  const threshold = config?.activation_threshold || 1000;
  const current = userCount || 0;
  const progress = Math.min((current / threshold) * 100, 100);

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
          {/* Founding Vendor Banner */}
          {showBanner && (
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 rounded-xl p-4 animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-1">
                <PartyPopper className="w-4 h-4 text-secondary shrink-0" />
                <p className="font-heading font-bold text-sm">
                  🔥 {vendorCount || 0}/100 Founding Vendors — 0% Commission Locked In Forever
                </p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Join now and keep 100% of your revenue. Commission activates at 3% after 100 vendors.</p>
              <div className="flex items-center gap-3 max-w-xs mx-auto">
                <Progress value={Math.min(((vendorCount || 0) / 100) * 100, 100)} className="h-2 flex-1" />
                <span className="text-xs font-heading font-bold text-primary whitespace-nowrap">
                  {vendorCount || 0} / 100
                </span>
              </div>
            </div>
          )}

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
          {[
            { value: animProducts, suffix: "+", label: t("hero.statProducts") },
            { value: animVendors, suffix: "+", label: t("hero.statVendors") },
            { value: animCountries, suffix: "+", label: t("hero.statCountries") },
            { value: "₵0", suffix: "", label: t("hero.statFee") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {typeof stat.value === "number" ? `${stat.value.toLocaleString()}${stat.suffix}` : stat.value}
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
