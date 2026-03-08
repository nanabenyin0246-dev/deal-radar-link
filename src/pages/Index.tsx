import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedVendors from "@/components/FeaturedVendors";
import HowItWorks from "@/components/HowItWorks";
import VendorCTA from "@/components/VendorCTA";
import RegionalOnboarding from "@/components/RegionalOnboarding";
import Footer from "@/components/Footer";
import { useI18n } from "@/i18n/I18nContext";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const { locale } = useI18n();
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
      <HeroSection />
      <RecentlyViewedSection />
      <CategoriesSection />
      <FeaturedProducts />
      <FeaturedVendors />
      <HowItWorks />
      <VendorCTA />
      <RegionalOnboarding region={showFrancophone ? "francophone" : "ghana"} />
      <Footer />
    </div>
  );
};

export default Index;
