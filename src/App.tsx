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
import PWAInstallBanner from "@/components/PWAInstallBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
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
import BuyersLanding from "./pages/BuyersLanding";
import VendorsLanding from "./pages/VendorsLanding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Auto-retry once on network errors
        if (failureCount >= 1) return false;
        const msg = (error as Error)?.message?.toLowerCase() || "";
        return msg.includes("network") || msg.includes("fetch") || msg.includes("failed");
      },
      staleTime: 1000 * 60 * 2, // 2 min default
    },
    mutations: {
      retry: 0,
    },
  },
});

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
              <Route path="/" element={<ErrorBoundary><Index /></ErrorBoundary>} />
              <Route path="/products" element={<ErrorBoundary><Products /></ErrorBoundary>} />
              <Route path="/product/:slug" element={<ErrorBoundary><ProductDetail /></ErrorBoundary>} />
              <Route path="/:lang/products/:slug" element={<ErrorBoundary><ProductDetail /></ErrorBoundary>} />
              <Route path="/auth" element={<ErrorBoundary><Auth /></ErrorBoundary>} />
              <Route path="/orders" element={<ErrorBoundary><BuyerOrders /></ErrorBoundary>} />
              <Route path="/vendor/dashboard" element={<ErrorBoundary><VendorDashboard /></ErrorBoundary>} />
              <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
              <Route path="/terms" element={<ErrorBoundary><Terms /></ErrorBoundary>} />
              <Route path="/privacy" element={<ErrorBoundary><Privacy /></ErrorBoundary>} />
              <Route path="/vendor-agreement" element={<ErrorBoundary><VendorAgreement /></ErrorBoundary>} />
              <Route path="/vendor/onboarding" element={<ErrorBoundary><VendorOnboardingConfirm /></ErrorBoundary>} />
              <Route path="/vendor/onboarding/confirm" element={<ErrorBoundary><VendorOnboardingConfirm /></ErrorBoundary>} />
              <Route path="/alerts" element={<ErrorBoundary><MyAlerts /></ErrorBoundary>} />
              <Route path="/buyers" element={<ErrorBoundary><BuyersLanding /></ErrorBoundary>} />
              <Route path="/reset-password" element={<ErrorBoundary><ResetPassword /></ErrorBoundary>} />
              <Route path="*" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
            <PWAInstallBanner />
          </BrowserRouter>
        </TooltipProvider>
        </CountryProvider>
        </CurrencyProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
