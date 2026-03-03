import { useCurrency } from "@/contexts/CurrencyContext";
import { getCurrencySymbol } from "@/hooks/useCurrencyConversion";

interface ConvertedPriceProps {
  amount: number;
  currency?: string;
  className?: string;
}

/**
 * Shows the original price + a converted price in the user's local currency (if different).
 */
const ConvertedPrice = ({ amount, currency = "GHS", className }: ConvertedPriceProps) => {
  const { convert, userCurrency } = useCurrency();
  const result = convert(amount, currency);

  if (!result) return null;

  return (
    <span className={`text-xs text-muted-foreground ${className || ""}`}>
      ≈ {result.symbol} {result.converted.toLocaleString()}
    </span>
  );
};

export default ConvertedPrice;
