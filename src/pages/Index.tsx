import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import HowItWorks from "@/components/HowItWorks";
import VendorCTA from "@/components/VendorCTA";
import RegionalOnboarding from "@/components/RegionalOnboarding";
import Footer from "@/components/Footer";
import { useI18n } from "@/i18n/I18nContext";

const Index = () => {
  const { locale } = useI18n();
  const showFrancophone = locale === "fr";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <HowItWorks />
      <VendorCTA />
      <RegionalOnboarding region={showFrancophone ? "francophone" : "ghana"} />
      <Footer />
    </div>
  );
};

export default Index;
