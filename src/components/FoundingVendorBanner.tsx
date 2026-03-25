import { useCommissionConfig } from "@/hooks/useCommissionConfig";
import { PartyPopper } from "lucide-react";

const FoundingVendorBanner = () => {
  const { data: config } = useCommissionConfig();

  if (!config || config.commission_active) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3">
        <PartyPopper className="w-5 h-5 text-secondary shrink-0" />
        <p className="font-heading font-bold text-sm">
          🎉 Founding Vendor — Join Africa's fastest-growing marketplace
        </p>
      </div>
    </div>
  );
};

export default FoundingVendorBanner;
