import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Search, Scale, MessageCircle, ShieldCheck, Globe, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const BuyersLanding = () => {
  const { data: vendorCount } = useQuery({
    queryKey: ["vendor-count"],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_vendor_count");
      return data || 0;
    },
  });

  const { data: countryCount } = useQuery({
    queryKey: ["country-count"],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_country_count");
      return data || 0;
    },
  });

  const { data: userCount } = useQuery({
    queryKey: ["user-count"],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_user_count");
      return data || 0;
    },
  });

  return (
    <>
      <SEOHead
        title="Stop Overpaying — Find Africa's Best Prices | RobCompare"
        description="Compare prices from verified vendors across Africa. Search any product, compare prices, and buy directly via WhatsApp. It's free."
      />
      <Navbar />
      <main className="min-h-screen bg-background">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
              Stop Overpaying.<br />
              <span className="text-primary">Find Africa's Best Prices Instantly.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground font-['DM_Sans'] max-w-2xl mx-auto">
              Compare prices from{" "}
              <span className="font-semibold text-foreground">{vendorCount ?? "…"} verified vendors</span>{" "}
              across{" "}
              <span className="font-semibold text-foreground">{countryCount ?? "…"} countries</span>.
              Buy directly via WhatsApp.
            </p>
            <Link to="/">
              <Button size="lg" className="mt-8 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow">
                Start Comparing — It's Free
              </Button>
            </Link>
          </div>
        </section>

        {/* ── PROBLEM ── */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
              Sound Familiar?
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: TrendingDown,
                  text: "Tired of not knowing if you're getting the best price?",
                },
                {
                  icon: Globe,
                  text: "Wasting time checking multiple websites and WhatsApp groups?",
                },
                {
                  icon: ShieldCheck,
                  text: "Buying from unverified sellers and getting scammed?",
                },
              ].map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-border bg-background shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-destructive" />
                  </div>
                  <p className="text-foreground font-['DM_Sans'] text-base md:text-lg leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOLUTION ── */}
        <section className="py-16 md:py-24 bg-accent/30">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-foreground mb-4">
              One Search. All Prices. Verified Vendors Only.
            </h2>
            <p className="text-muted-foreground text-lg mb-10 font-['DM_Sans'] max-w-2xl mx-auto">
              RobCompare aggregates prices from trusted sellers across Africa so you can compare and buy with confidence — all in one place.
            </p>
            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden p-6 md:p-8">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl bg-background border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
                      <div className="space-y-1.5 text-left">
                        <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                        <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`font-['Space_Grotesk'] font-bold text-lg ${i === 1 ? "text-primary" : "text-foreground"}`}>
                        {i === 1 ? "GHS 2,499" : i === 2 ? "GHS 2,750" : "GHS 3,100"}
                      </div>
                      {i === 1 && (
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Best Price
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF ── */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-primary">
                  {vendorCount ?? "—"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 font-['DM_Sans']">Verified Vendors</p>
              </div>
              <div>
                <p className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-primary">
                  {countryCount ?? "—"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 font-['DM_Sans']">Countries</p>
              </div>
              <div>
                <p className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-primary">
                  {userCount ?? "—"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 font-['DM_Sans']">Smart Buyers</p>
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-6 font-['DM_Sans'] text-base">
              Join <span className="font-semibold text-foreground">{userCount ?? "…"} smart buyers</span> already saving money.
            </p>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: Search, label: "Search any product", desc: "Type what you're looking for and see every vendor's price." },
                { icon: Scale, label: "Compare verified prices", desc: "Prices from verified vendors ranked side by side." },
                { icon: MessageCircle, label: "Buy via WhatsApp instantly", desc: "Message the vendor directly. No middleman, no fees." },
              ].map(({ icon: Icon, label, desc }, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="font-['Space_Grotesk'] text-sm font-semibold text-muted-foreground tracking-widest uppercase">
                    Step {i + 1}
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-foreground">
                    {label}
                  </h3>
                  <p className="text-muted-foreground font-['DM_Sans'] text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-4xl font-bold text-foreground mb-4">
              Start finding better prices now
            </h2>
            <p className="text-muted-foreground text-lg font-['DM_Sans'] mb-8">
              No signup required. Just search, compare, and save.
            </p>
            <Link to="/">
              <Button size="lg" className="text-lg px-10 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow">
                Start Comparing — It's Free
              </Button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default BuyersLanding;
