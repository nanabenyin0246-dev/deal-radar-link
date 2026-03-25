import { useAdminAuditLog } from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Globe, Mail, Wifi } from "lucide-react";

interface FraudSignal {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  details: any;
  ip_address: string | null;
  created_at: string;
}

const FraudSignalsTab = () => {
  const { data: auditLog } = useAdminAuditLog();

  const fraudEntries = (auditLog || []).filter(
    (entry: FraudSignal) =>
      entry.action === "fraud_signal" ||
      entry.action === "vendor_signup_fraud_check" ||
      (entry.details && typeof entry.details === "object" && (entry.details as any)?.isVPN)
  );

  const getRiskLevel = (details: any): "high" | "medium" | "low" => {
    if (!details) return "low";
    const flags = [details.isVPN, details.isProxy, details.isDisposableEmail, details.isTor].filter(Boolean).length;
    if (flags >= 2) return "high";
    if (flags >= 1) return "medium";
    return "low";
  };

  const riskColors: Record<string, string> = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-orange-500 text-white",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-3">
      {!fraudEntries.length ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-heading font-semibold">No fraud signals detected</p>
          <p className="text-sm text-muted-foreground mt-1">Signup fraud checks will appear here</p>
        </div>
      ) : (
        fraudEntries.map((entry: FraudSignal) => {
          const d = entry.details as any || {};
          const risk = getRiskLevel(d);
          return (
            <div
              key={entry.id}
              className={`bg-card border rounded-xl p-4 ${risk === "high" ? "border-destructive/50" : "border-border"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={`w-4 h-4 shrink-0 ${risk === "high" ? "text-destructive" : risk === "medium" ? "text-orange-500" : "text-muted-foreground"}`} />
                    <span className="font-heading font-semibold text-sm truncate">
                      {d.email || entry.user_id?.slice(0, 8) || "Unknown"}
                    </span>
                    <Badge className={riskColors[risk]}>{risk} risk</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {d.isVPN && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Wifi className="w-3 h-3" /> VPN
                      </Badge>
                    )}
                    {d.isProxy && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Globe className="w-3 h-3" /> Proxy
                      </Badge>
                    )}
                    {d.isTor && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Shield className="w-3 h-3" /> Tor
                      </Badge>
                    )}
                    {d.isDisposableEmail && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Mail className="w-3 h-3" /> Disposable Email
                      </Badge>
                    )}
                  </div>

                  {(d.ip || entry.ip_address) && (
                    <p className="text-xs text-muted-foreground mt-2">
                      IP: {d.ip || entry.ip_address} {d.country ? `· ${d.country}` : ""}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FraudSignalsTab;
