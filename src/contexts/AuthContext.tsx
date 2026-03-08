import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { sendEmail, emailTemplates } from "@/utils/sendEmail";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isVendor: boolean;
  isAdmin: boolean;
  vendorId: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isVendor: false,
  isAdmin: false,
  vendorId: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);

  const completePendingVendor = async (userId: string) => {
    const pending = localStorage.getItem("pending_vendor");
    if (!pending) return;
    try {
      const info = JSON.parse(pending);
      const { data: existing } = await supabase.from("vendors").select("id").eq("user_id", userId).maybeSingle();
      if (existing) { localStorage.removeItem("pending_vendor"); return; }

      const { data: vendorData } = await supabase.from("vendors").insert({
        user_id: userId,
        business_name: info.businessName,
        whatsapp_number: info.whatsappNumber,
        city: info.city || null,
        country: info.country || "Ghana",
        email: info.email,
      }).select().single();

      await supabase.from("user_roles").insert({ user_id: userId, role: "vendor" as const });

      // Log agreement acceptance
      if (vendorData) {
        await supabase.from("vendor_agreements").insert({
          vendor_id: vendorData.id,
          user_id: userId,
          agreement_version: info.agreement_version || "1.0",
          user_agent: info.user_agent,
        });

        // Audit log
        await supabase.from("audit_log").insert({
          user_id: userId,
          action: "vendor_registered",
          entity_type: "vendor",
          entity_id: vendorData.id,
          details: { agreement_version: info.agreement_version, business_name: info.businessName },
        });

        // Record referral if exists
        if (info.referrer_vendor_id) {
          await supabase.from("referrals").insert({
            referrer_vendor_id: info.referrer_vendor_id,
            referred_email: info.email,
            referred_vendor_id: vendorData.id,
            status: "signed_up",
          });
          localStorage.removeItem("robcompare_referrer");
        }

        // Send welcome email
        if (info.email) {
          sendEmail({
            to: info.email,
            subject: "Welcome to RobCompare — You're a Founding Vendor! 🎉",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h1 style="color: #16a34a;">Welcome to RobCompare!</h1>
                <p>You're officially a founding vendor.</p>
                <p>You keep <strong>100% of your revenue</strong> until we hit 1,000 users.</p>
                <a href="https://deal-radar-link.lovable.app/vendor/dashboard"
                   style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
                  Go to My Dashboard →
                </a>
                <p style="color: #6b7280; margin-top: 24px;">Welcome to the family. 🚀<br/>The RobCompare Team</p>
              </div>
            `,
          }).catch(console.error);
        }
      }

      localStorage.removeItem("pending_vendor");
    } catch {}
  };

  const checkRoles = async (userId: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    const hasVendorRole = roles?.some((r) => r.role === "vendor") || false;
    const hasAdminRole = roles?.some((r) => r.role === "admin") || false;
    setIsVendor(hasVendorRole);
    setIsAdmin(hasAdminRole);

    if (hasVendorRole) {
      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      setVendorId(vendor?.id || null);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          // Use setTimeout to avoid blocking the auth state change callback
          setTimeout(() => {
            completePendingVendor(session.user.id).then(() => {
              checkRoles(session.user.id);
            });
          }, 0);
        } else {
          setIsVendor(false);
          setIsAdmin(false);
          setVendorId(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        completePendingVendor(session.user.id).then(() => {
          checkRoles(session.user.id);
        });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsVendor(false);
    setIsAdmin(false);
    setVendorId(null);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user || null, loading, isVendor, isAdmin, vendorId, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
