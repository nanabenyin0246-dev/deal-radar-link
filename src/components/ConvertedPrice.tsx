import { useCurrency } from "@/contexts/CurrencyContext";
import { formatNumber } from "@/utils/currency";

interface ConvertedPriceProps {
  amount: number;
  currency?: string;
  className?: string;
}

const ConvertedPrice = ({ amount, currency = "GHS", className }: ConvertedPriceProps) => {
  const { convert, userCurrency } = useCurrency();
  const result = convert(amount, currency);

  if (!result) return null;

  return (
    <span className={`text-xs text-muted-foreground ${className || ""}`}>
      ≈ {result.symbol} {formatNumber(result.converted)}
    </span>
  );
};

export default ConvertedPrice;
