import { useCurrency } from "@/contexts/CurrencyContext";
import { getCurrencySymbol } from "@/hooks/useCurrencyConversion";
import { Globe } from "lucide-react";

const POPULAR_CURRENCIES = [
  "GHS", "NGN", "USD", "EUR", "GBP", "KES", "ZAR", "XOF",
  "EGP", "TZS", "UGX", "INR", "CAD", "AUD", "BRL",
];

const CurrencySelector = () => {
  const { userCurrency, setUserCurrency, detectedCountry } = useCurrency();

  return (
    <div className="flex items-center gap-1">
      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
      <select
        value={userCurrency}
        onChange={(e) => setUserCurrency(e.target.value)}
        className="bg-transparent text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer border-none outline-none appearance-none pr-4"
        title={detectedCountry ? `Detected: ${detectedCountry}` : "Select currency"}
      >
        {POPULAR_CURRENCIES.map((code) => (
          <option key={code} value={code} className="bg-card text-foreground">
            {getCurrencySymbol(code)} {code}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
