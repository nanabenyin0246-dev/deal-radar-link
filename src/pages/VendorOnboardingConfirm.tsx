import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle } from "lucide-react";

const VendorOnboardingConfirm = () => {
  const { user, loading, isVendor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in yet — might still be processing the token
      const timeout = setTimeout(() => navigate("/auth"), 5000);
      return () => clearTimeout(timeout);
    }

    // User is authenticated — pending_vendor will be processed by AuthContext
    // Wait a moment for completePendingVendor to finish, then redirect
    const redirect = setTimeout(() => {
      localStorage.removeItem("vendor_onboarding_step");
      navigate("/vendor/dashboard", { replace: true });
    }, 2000);

    return () => clearTimeout(redirect);
  }, [user, loading, isVendor, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-md py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
          {loading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <CheckCircle className="w-8 h-8 text-primary" />
          )}
        </div>
        <h1 className="font-heading text-2xl font-bold">
          {loading ? "Verifying your account..." : "Email confirmed!"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Please wait while we set up your vendor account."
            : "Setting up your vendor dashboard. You'll be redirected shortly."}
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default VendorOnboardingConfirm;
