import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import NearbyVendors from "@/components/NearbyVendors";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedVendors from "@/components/FeaturedVendors";
import HowItWorks from "@/components/HowItWorks";
import HowToSell from "@/components/HowToSell";
import VendorCTA from "@/components/VendorCTA";
import LiveTicker from "@/components/LiveTicker";
import RegionalOnboarding from "@/components/RegionalOnboarding";
import Footer from "@/components/Footer";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const { locale } = useI18n();
  const { user } = useAuth();
  const showFrancophone = locale === "fr";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Compare Prices Across Africa"
        description="Find the best deals from verified vendors across Africa. Compare prices on electronics, fashion, beauty and more — buy direct via WhatsApp."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "RobCompare",
          url: window.location.origin,
          potentialAction: {
            "@type": "SearchAction",
            target: `${window.location.origin}/products?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Navbar />
      <LiveTicker />
      <HeroSection />
      <RecentlyViewedSection />
      <CategoriesSection />
      <FeaturedProducts />
      <FeaturedVendors />
      <section className="container py-8">
        <NearbyVendors />
      </section>
      <HowToSell />
      <HowItWorks />
      <VendorCTA />
      <RegionalOnboarding region={showFrancophone ? "francophone" : "ghana"} />
      <Footer />
    </div>
  );
};

export default Index;
