import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Copy, MessageCircle, Gift, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ReferralSection = ({ vendorId }: { vendorId: string | null }) => {
  const { toast } = useToast();

  const { data: referrals } = useQuery({
    queryKey: ["vendor-referrals", vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const { data, error } = await supabase
        .from("referrals")
        .select("*, referred_vendor:vendors!referrals_referred_vendor_id_fkey(business_name)")
        .eq("referrer_vendor_id", vendorId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });

  if (!vendorId) return null;

  const referralLink = `https://deal-radar-link.lovable.app/auth?ref=${vendorId}`;
  const whatsappMsg = encodeURIComponent(
    `I'm a founding vendor on RobCompare — the new African price comparison marketplace. Join me and get 0% commission: ${referralLink}`
  );
  const signedUp = referrals?.filter((r: any) => r.status === "signed_up").length || 0;

  return (
    <div className="mt-10">
      <h2 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4">
        <Gift className="w-5 h-5 text-primary" /> Refer a Vendor
      </h2>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <p className="text-sm text-muted-foreground">
          Share your referral link and grow the RobCompare community. Refer 5 vendors to get featured on the homepage!
        </p>

        {/* Referral Link */}
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={referralLink}
            className="flex-1 h-9 rounded-md border border-input bg-muted px-3 text-xs text-muted-foreground truncate"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(referralLink);
              toast({ title: "Link copied!" });
            }}
          >
            <Copy className="w-3 h-3" /> Copy
          </Button>
          <Button size="sm" variant="whatsapp" asChild>
            <a href={`https://wa.me/?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-3 h-3" /> Share
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">You've referred <strong className="text-primary">{signedUp}</strong> vendor{signedUp !== 1 ? "s" : ""}</span>
        </div>

        {/* Referral List */}
        {referrals && referrals.length > 0 && (
          <div className="space-y-2">
            {referrals.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-2 px-3">
                <span className="text-sm truncate">
                  {(r.referred_vendor as any)?.business_name || r.referred_email || "—"}
                </span>
                <Badge variant={r.status === "signed_up" ? "default" : "outline"} className="text-[10px]">
                  {r.status === "signed_up" ? "Signed Up" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralSection;
