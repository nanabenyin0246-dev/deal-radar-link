import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/i18n/I18nContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CountryProvider } from "@/contexts/CountryContext";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import BuyerOrders from "./pages/BuyerOrders";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import VendorAgreement from "./pages/VendorAgreement";
import ResetPassword from "./pages/ResetPassword";
import VendorOnboardingConfirm from "./pages/VendorOnboardingConfirm";
import MyAlerts from "./pages/MyAlerts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <CurrencyProvider>
        <CountryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/:lang/products/:slug" element={<ProductDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/orders" element={<BuyerOrders />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/vendor-agreement" element={<VendorAgreement />} />
              <Route path="/vendor/onboarding/confirm" element={<VendorOnboardingConfirm />} />
              <Route path="/alerts" element={<MyAlerts />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
        </CountryProvider>
        </CurrencyProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
