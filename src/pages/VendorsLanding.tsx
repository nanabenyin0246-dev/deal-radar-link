import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { UserPlus, Package, MessageCircle, ShieldCheck, Eye, Zap, ChevronDown } from "lucide-react";
import { useState } from "react";

const FOUNDING_VENDOR_CAP = 100;

const VendorsLanding = () => {
  const { data: vendorCount } = useQuery({
    queryKey: ["vendor-count"],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_vendor_count");
      return data || 0;
    },
  });

  const spotsRemaining = Math.max(0, FOUNDING_VENDOR_CAP - (vendorCount ?? 0));

  return (
    <>
      <SEOHead
        title="Sell to More Buyers Across Africa — For Free | RobCompare"
        description="List your products on RobCompare for free. Join as a founding vendor with 0% commission. Get discovered by buyers searching for what you sell."
      />
      <Navbar />
      <main className="min-h-screen bg-background">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
              Sell to More Buyers Across Africa —{" "}
              <span className="text-primary">For Free</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground font-['DM_Sans'] max-w-2xl mx-auto">
              List your products on RobCompare and get discovered by buyers searching for exactly what you sell.
            </p>
            <Link to="/auth?tab=vendor">
              <Button size="lg" className="mt-8 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow">
                Join as a Founding Vendor — 0% Commission
              </Button>
            </Link>
          </div>
        </section>

        {/* ── FOUNDING VENDOR BANNER ── */}
        <section className="py-8 bg-secondary/10 border-y border-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <p className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold text-foreground">
              🔥 Limited: First {FOUNDING_VENDOR_CAP} vendors pay{" "}
              <span className="text-primary">0% commission forever</span>.
            </p>
            <p className="mt-2 text-lg font-['DM_Sans']">
              <span className="font-bold text-secondary text-2xl">{spotsRemaining}</span>{" "}
              <span className="text-muted-foreground">spots remaining</span>
            </p>
            <div className="mt-4 max-w-md mx-auto h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                style={{ width: `${Math.min(100, ((vendorCount ?? 0) / FOUNDING_VENDOR_CAP) * 100)}%` }}
              />
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
              Why Vendors Choose RobCompare
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Eye,
                  title: "Free Exposure",
                  desc: "Get discovered by buyers actively searching for your products. No ad spend needed.",
                },
                {
                  icon: MessageCircle,
                  title: "Direct WhatsApp Inquiries",
                  desc: "Buyers message you directly on WhatsApp. No middleman, no delays.",
                },
                {
                  icon: ShieldCheck,
                  title: "Verified Badge",
                  desc: "Stand out with a verified vendor badge that builds buyer trust instantly.",
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-foreground">{title}</h3>
                  <p className="text-muted-foreground font-['DM_Sans'] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-16 md:py-24 bg-accent/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
              Get Started in 3 Easy Steps
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: UserPlus, label: "Sign up free", desc: "Create your vendor account in under a minute." },
                { icon: Package, label: "List your products", desc: "Add your products with prices. Takes about 5 minutes." },
                { icon: Zap, label: "Start getting orders", desc: "Buyers contact you directly on WhatsApp. That's it." },
              ].map(({ icon: Icon, label, desc }, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground font-['Space_Grotesk'] text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-foreground">{label}</h3>
                  <p className="text-muted-foreground font-['DM_Sans'] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL ── */}
        <section className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="p-8 rounded-2xl border border-border bg-background">
              <p className="text-xl md:text-2xl text-foreground font-['DM_Sans'] italic leading-relaxed">
                "RobCompare got me my first 3 orders in a week."
              </p>
              <p className="mt-4 text-muted-foreground font-['Space_Grotesk'] font-semibold">
                — Founding Vendor
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Is it really free?",
                  a: "Yes. Founding vendors pay 0% commission until we reach 1,000 users. After that, a small commission applies — but you'll already have customers.",
                },
                {
                  q: "How do buyers contact me?",
                  a: "Directly via WhatsApp. No fees, no delays, no middleman. You keep the full relationship with your customer.",
                },
                {
                  q: "How long does approval take?",
                  a: "Within 24 hours. Most vendors are approved the same day.",
                },
              ].map(({ q, a }, i) => (
                <FAQItem key={i} question={q} answer={a} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-4xl font-bold text-foreground mb-4">
              Claim Your Founding Vendor Spot
            </h2>
            <p className="text-muted-foreground text-lg font-['DM_Sans'] mb-2">
              Only <span className="font-bold text-secondary">{spotsRemaining}</span> spots left at 0% commission.
            </p>
            <Link to="/auth?tab=vendor">
              <Button size="lg" className="mt-6 text-lg px-10 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow">
                Join as a Founding Vendor — It's Free
              </Button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted/50 transition-colors"
      >
        <span className="font-['Space_Grotesk'] font-semibold text-foreground">{question}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 bg-card">
          <p className="text-muted-foreground font-['DM_Sans'] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default VendorsLanding;
