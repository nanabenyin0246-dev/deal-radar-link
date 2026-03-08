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
        <span title="Verified vendor"><CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /></span>
      )}
      {verified === false && (
        <span title="Pending verification"><Clock className="w-3.5 h-3.5 text-amber shrink-0" /></span>
      )}
    </div>
  );
};

export default VendorBadge;
