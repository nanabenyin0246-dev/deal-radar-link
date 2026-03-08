import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, Mail, Lock, User, Phone, MapPin, Store } from "lucide-react";

type AuthMode = "login" | "signup" | "vendor-signup" | "forgot-password";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const { isVendor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Handle referral param
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("robcompare_referrer", ref);
      // Fetch referrer name
      supabase.from("vendors").select("business_name").eq("id", ref).maybeSingle().then(({ data }) => {
        if (data) setReferrerName(data.business_name);
      });
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      // Role-based redirect handled by AuthContext loading
      // Check roles after login to redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
        const hasVendor = roles?.some(r => r.role === "vendor");
        navigate(hasVendor ? "/vendor/dashboard" : "/");
      } else {
        navigate("/");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://deal-radar-link.lovable.app",
        data: { display_name: displayName },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      setEmailSent(true);
    }
  };

  const handleVendorSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !whatsappNumber) {
      toast({ title: "Missing fields", description: "Business name and WhatsApp number are required.", variant: "destructive" });
      return;
    }
    if (!agreedToTerms) {
      toast({ title: "Agreement required", description: "You must accept the Vendor Agreement to register.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/vendor/onboarding`,
        data: { display_name: businessName, role: "vendor" },
      },
    });
    if (authError) {
      setLoading(false);
      toast({ title: "Signup failed", description: authError.message, variant: "destructive" });
      return;
    }

    if (authData.user) {
      const referrer = localStorage.getItem("robcompare_referrer");
      localStorage.setItem("pending_vendor", JSON.stringify({
        businessName, whatsappNumber, city, country, email,
        agreement_version: "1.0",
        agreed_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer_vendor_id: referrer || null,
      }));
    }

    setLoading(false);
    setEmailSent(true);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setResetSent(true);
    }
  };

  if (resetSent) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-md py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent a password reset link to <strong>{email}</strong>. It expires in 15 minutes.
          </p>
          <Button variant="outline" onClick={() => { setResetSent(false); setMode("login"); }}>
            Back to Login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-md py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <Button variant="outline" onClick={() => { setEmailSent(false); setMode("login"); }}>
            Back to Login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Determine which tabs to show - hide vendor tab if already a vendor
  const availableModes: AuthMode[] = isVendor
    ? ["login", "signup"]
    : ["login", "signup", "vendor-signup"];

  const modeLabels: Record<string, string> = {
    "login": "Sign In",
    "signup": "Sign Up",
    "vendor-signup": "Vendor",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-md py-12">
        {/* Referral welcome */}
        {referrerName && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-center animate-fade-in">
            <p className="text-sm font-medium">
              You were referred by <strong className="text-primary">{referrerName}</strong> — welcome to RobCompare! 🎉
            </p>
          </div>
        )}
        {mode === "forgot-password" ? (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="font-heading text-2xl font-bold">Reset Password</h1>
              <p className="text-sm text-muted-foreground mt-1">Enter your email to receive a reset link</p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setMode("login")}>
                Back to Login
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="font-heading text-2xl font-bold">
                {mode === "login" ? "Welcome back" : mode === "signup" ? "Create account" : "Register as Vendor"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "vendor-signup" ? "Start selling on RobCompare" : "Compare prices & save money"}
              </p>
            </div>

            <div className="flex rounded-xl bg-muted p-1 mb-6">
              {availableModes.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {modeLabels[m]}
                </button>
              ))}
            </div>

            <form onSubmit={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleVendorSignup} className="space-y-4">
              {(mode === "signup" || mode === "vendor-signup") && (
                <div className="space-y-2">
                  <Label htmlFor="name">{mode === "vendor-signup" ? "Business Name" : "Display Name"}</Label>
                  <div className="relative">
                    {mode === "vendor-signup" ? <Store className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /> : <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />}
                    <Input
                      id="name"
                      placeholder={mode === "vendor-signup" ? "Your business name" : "Your name"}
                      value={mode === "vendor-signup" ? businessName : displayName}
                      onChange={(e) => mode === "vendor-signup" ? setBusinessName(e.target.value) : setDisplayName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <button type="button" onClick={() => setMode("forgot-password")} className="text-xs text-primary hover:underline">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
                </div>
              </div>

              {mode === "vendor-signup" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="whatsapp" placeholder="233200000000" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input id="city" placeholder="Accra" value={city} onChange={(e) => setCity(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Checkbox
                      id="agree"
                      checked={agreedToTerms}
                      onCheckedChange={(v) => setAgreedToTerms(v === true)}
                    />
                    <label htmlFor="agree" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                      I have read and agree to the{" "}
                      <a href="/vendor-agreement" target="_blank" className="text-primary hover:underline">Vendor Agreement (v1.0)</a>
                      {", "}
                      <a href="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</a>
                      {", and "}
                      <a href="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</a>.
                      I understand that RobCompare is a marketplace intermediary and I am solely responsible for my products.
                    </label>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading || (mode === "vendor-signup" && !agreedToTerms)}>
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Register as Vendor"}
              </Button>
            </form>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
