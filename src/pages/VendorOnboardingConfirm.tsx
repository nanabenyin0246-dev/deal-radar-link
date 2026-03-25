import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle } from "lucide-react";

const VendorOnboardingConfirm = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "confirmed">("loading");

  useEffect(() => {
    // Handle email confirmation via OTP token_hash (PKCE flow)
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const type = params.get("type");

    if (token_hash && type === "signup") {
      supabase.auth.verifyOtp({ token_hash, type: "signup" }).then(({ error }) => {
        if (error) {
          console.error("OTP verification failed:", error);
          navigate("/auth");
        }
      });
      return;
    }

    // Fallback: handle hash fragment tokens (legacy redirect flow)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (accessToken && refreshToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error }) => {
        if (error) {
          console.error("Session recovery failed:", error);
          navigate("/auth");
        }
      });
    }
  }, [navigate]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in yet — might still be processing the token
      const timeout = setTimeout(() => navigate("/auth"), 8000);
      return () => clearTimeout(timeout);
    }

    setStatus("confirmed");

    // Check if user is a vendor before redirecting
    const redirect = setTimeout(async () => {
      localStorage.removeItem("vendor_onboarding_step");
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const isVendor = roles?.some(r => r.role === "vendor");
      navigate(isVendor ? "/vendor/dashboard" : "/", { replace: true });
    }, 2500);

    return () => clearTimeout(redirect);
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-md py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
          {status === "loading" ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <CheckCircle className="w-8 h-8 text-primary" />
          )}
        </div>
        <h1 className="font-heading text-2xl font-bold">
          {status === "loading" ? "Verifying your account..." : "Email confirmed!"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {status === "loading"
            ? "Please wait while we set up your vendor account."
            : "Setting up your vendor dashboard. You'll be redirected shortly."}
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default VendorOnboardingConfirm;
