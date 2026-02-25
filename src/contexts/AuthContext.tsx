import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isVendor: boolean;
  vendorId: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isVendor: false,
  vendorId: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);

  const completePendingVendor = async (userId: string) => {
    const pending = localStorage.getItem("pending_vendor");
    if (!pending) return;
    try {
      const info = JSON.parse(pending);
      // Check if vendor already exists
      const { data: existing } = await supabase.from("vendors").select("id").eq("user_id", userId).maybeSingle();
      if (existing) { localStorage.removeItem("pending_vendor"); return; }
      // Create vendor record
      await supabase.from("vendors").insert({
        user_id: userId,
        business_name: info.businessName,
        whatsapp_number: info.whatsappNumber,
        city: info.city || null,
        country: info.country || "Ghana",
        email: info.email,
      });
      // Add vendor role
      await supabase.from("user_roles").insert({ user_id: userId, role: "vendor" as const });
      localStorage.removeItem("pending_vendor");
    } catch {}
  };

  const checkVendorStatus = async (userId: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const hasVendorRole = roles?.some((r) => r.role === "vendor") || false;
    setIsVendor(hasVendorRole);

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
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          // Check for pending vendor registration
          await completePendingVendor(session.user.id);
          await checkVendorStatus(session.user.id);
        } else {
          setIsVendor(false);
          setVendorId(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkVendorStatus(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsVendor(false);
    setVendorId(null);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user || null, loading, isVendor, vendorId, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
