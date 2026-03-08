import { Badge } from "@/components/ui/badge";
import { calculateDealScore, getDealScoreLabel } from "@/utils/dealScore";

interface DealScoreBadgeProps {
  price: number;
  averagePrice: number;
  vendorVerified: boolean;
  updatedAt: string;
  showScore?: boolean;
  className?: string;
}

const DealScoreBadge = ({
  price,
  averagePrice,
  vendorVerified,
  updatedAt,
  showScore = false,
  className = "",
}: DealScoreBadgeProps) => {
  const score = calculateDealScore({ price, averagePrice, vendorVerified, updatedAt });
  const label = getDealScoreLabel(score);

  return (
    <Badge className={`${label.colorClass} text-xs font-semibold ${className}`}>
      {label.emoji} {label.text}{showScore ? ` (${score})` : ""}
    </Badge>
  );
};

export default DealScoreBadge;
