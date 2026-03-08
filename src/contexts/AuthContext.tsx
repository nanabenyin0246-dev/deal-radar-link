import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

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
