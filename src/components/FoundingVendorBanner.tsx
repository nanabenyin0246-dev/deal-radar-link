import { useCommissionConfig, useUserCount } from "@/hooks/useCommissionConfig";
import { Progress } from "@/components/ui/progress";
import { PartyPopper } from "lucide-react";

const FoundingVendorBanner = () => {
  const { data: config } = useCommissionConfig();
  const { data: userCount } = useUserCount();

  if (!config || config.commission_active) return null;

  const threshold = config.activation_threshold || 1000;
  const current = userCount || 0;
  const progress = Math.min((current / threshold) * 100, 100);

  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <PartyPopper className="w-5 h-5 text-secondary shrink-0" />
        <p className="font-heading font-bold text-sm">
          🎉 Founding Vendor Program – 0% Commission Until {threshold.toLocaleString()} Users
        </p>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        You keep 100% of revenue! Commission activates at 3% once we reach {threshold.toLocaleString()} registered users.
      </p>
      <div className="flex items-center gap-3">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-xs font-heading font-bold text-primary whitespace-nowrap">
          {current.toLocaleString()} / {threshold.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default FoundingVendorBanner;
