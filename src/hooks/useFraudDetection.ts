import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FraudSignals {
  ipRiskScore: number;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
  isDisposableEmail: boolean;
  overallRisk: "low" | "medium" | "high";
  reasons: string[];
}

const DISPOSABLE_DOMAINS = [
  "mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com",
  "throwaway.email", "fakeinbox.com", "yopmail.com", "sharklasers.com",
  "guerrillamailblock.com", "spam4.me", "trashmail.com", "dispostable.com",
  "mailnull.com", "spamgourmet.com", "spamgourmet.net", "spamgourmet.org",
  "getairmail.com", "filzmail.com", "discard.email", "spamhereplease.com",
];

export const isDisposableEmail = (email: string): boolean => {
  const domain = email.toLowerCase().split("@")[1];
  return DISPOSABLE_DOMAINS.includes(domain);
};

export const useIPFraudCheck = () => {
  return useMutation({
    mutationFn: async (email: string): Promise<FraudSignals> => {
      const reasons: string[] = [];
      let ipRiskScore = 0;
      let isVpn = false;
      let isProxy = false;
      let isTor = false;

      const isDisposable = isDisposableEmail(email);
      if (isDisposable) reasons.push("Disposable email address detected");

      try {
        const ipRes = await fetch("https://ipwho.is/");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          isVpn = ipData.connection?.type === "VPN";
          isProxy = ipData.connection?.type === "Proxy";
          isTor = ipData.connection?.type === "Tor";

          if (isVpn) reasons.push("VPN detected");
          if (isProxy) reasons.push("Proxy detected");
          if (isTor) reasons.push("Tor network detected");

          const abuseKey = import.meta.env.VITE_ABUSEIPDB_KEY;
          if (abuseKey && ipData.ip) {
            try {
              const abuseRes = await fetch(
                `https://api.abuseipdb.com/api/v2/check?ipAddress=${ipData.ip}&maxAgeInDays=90`,
                { headers: { Key: abuseKey, Accept: "application/json" } }
              );
              if (abuseRes.ok) {
                const abuseData = await abuseRes.json();
                ipRiskScore = abuseData.data?.abuseConfidenceScore || 0;
                if (ipRiskScore > 25) reasons.push(`IP reported for abuse (score: ${ipRiskScore})`);
              }
            } catch { /* skip */ }
          }
        }
      } catch { /* skip */ }

      const riskPoints =
        (isDisposable ? 30 : 0) +
        (isVpn ? 15 : 0) +
        (isProxy ? 20 : 0) +
        (isTor ? 25 : 0) +
        (ipRiskScore > 25 ? 30 : ipRiskScore > 10 ? 15 : 0);

      const overallRisk: "low" | "medium" | "high" =
        riskPoints >= 50 ? "high" : riskPoints >= 20 ? "medium" : "low";

      return { ipRiskScore, isVpn, isProxy, isTor, isDisposableEmail: isDisposable, overallRisk, reasons };
    },
  });
};

export const logFraudSignal = async (
  userId: string | null,
  email: string,
  signals: FraudSignals
) => {
  if (signals.overallRisk === "low") return;
  try {
    await supabase.from("audit_log").insert({
      user_id: userId,
      action: "fraud_signal_detected",
      entity_type: "vendor_signup",
      details: {
        email,
        risk: signals.overallRisk,
        score: signals.ipRiskScore,
        reasons: signals.reasons,
        isVpn: signals.isVpn,
        isProxy: signals.isProxy,
        isTor: signals.isTor,
        isDisposableEmail: signals.isDisposableEmail,
      },
    });
  } catch { /* non-critical */ }
};
