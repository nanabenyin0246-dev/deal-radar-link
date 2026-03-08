import { Shield, CheckCircle, Clock } from "lucide-react";
import { useCountryLookup } from "@/contexts/CountryContext";

interface VendorBadgeProps {
  businessName: string;
  country?: string | null;
  verified?: boolean | null;
  showFlag?: boolean;
  className?: string;
}

const VendorBadge = ({
  businessName,
  country,
  verified,
  showFlag = true,
  className = "",
}: VendorBadgeProps) => {
  const { getCountry } = useCountryLookup();
  const countryData = country ? getCountry(country) : undefined;

  return (
    <div className={`flex items-center gap-1.5 min-w-0 ${className}`}>
      {showFlag && countryData?.flag && (
        <span className="text-sm shrink-0" title={countryData.name}>
          {countryData.flag}
        </span>
      )}
      <span className="truncate">{businessName}</span>
      {verified === true && (
        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" title="Verified vendor" />
      )}
      {verified === false && (
        <Clock className="w-3.5 h-3.5 text-warning shrink-0" title="Pending verification" />
      )}
    </div>
  );
};

export default VendorBadge;
