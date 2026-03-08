import { useQuery } from "@tanstack/react-query";

interface ExchangeRates {
  [currency: string]: number;
}

export const useExchangeRates = (baseCurrency: string = "ghs") => {
  return useQuery<ExchangeRates>({
    queryKey: ["exchange-rates", baseCurrency.toLowerCase()],
    queryFn: async () => {
      const base = baseCurrency.toLowerCase();
      try {
        const res = await fetch(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`
        );
        if (!res.ok) throw new Error("Currency-API failed");
        const data = await res.json();
        return data[base] as ExchangeRates;
      } catch {
        // Fallback to Frankfurter (fewer currencies but reliable)
        const res = await fetch(
          `https://api.frankfurter.app/latest?from=${baseCurrency.toUpperCase()}`
        );
        if (!res.ok) throw new Error("FX fetch failed");
        const data = await res.json();
        return data.rates as ExchangeRates;
      }
    },
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    gcTime: 1000 * 60 * 60 * 12,
    retry: 1,
  });
};

export const convertPrice = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates | undefined
): { converted: number; symbol: string } | null => {
  if (!rates || fromCurrency.toLowerCase() === toCurrency.toLowerCase()) return null;
  const rate = rates[toCurrency.toLowerCase()];
  if (!rate) return null;
  return {
    converted: Math.round(amount * rate * 100) / 100,
    symbol: getCurrencySymbol(toCurrency),
  };
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", NGN: "₦", GHS: "GH₵", KES: "KSh",
  ZAR: "R", XOF: "CFA", XAF: "FCFA", EGP: "E£", MAD: "MAD",
  TZS: "TSh", UGX: "USh", RWF: "RF", INR: "₹", JPY: "¥",
  CNY: "¥", BRL: "R$", CAD: "C$", AUD: "A$", AED: "د.إ",
};

export const getCurrencySymbol = (code: string): string => {
  return CURRENCY_SYMBOLS[code.toUpperCase()] || code.toUpperCase();
};
