import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { useExchangeRates, convertPrice, getCurrencySymbol } from "@/hooks/useCurrencyConversion";

interface CurrencyContextType {
  /** The user's detected or selected target currency code (e.g. "NGN") */
  userCurrency: string;
  userCurrencySymbol: string;
  /** The base currency products are listed in */
  baseCurrency: string;
  /** Convert a price from base currency to user currency. Returns null if same currency or no rate. */
  convert: (amount: number, fromCurrency?: string) => { converted: number; symbol: string } | null;
  /** Override the auto-detected currency */
  setUserCurrency: (code: string) => void;
  /** Whether geo detection is still loading */
  isDetecting: boolean;
  /** Detected country name */
  detectedCountry: string | null;
}

const CurrencyContext = createContext<CurrencyContextType>({
  userCurrency: "GHS",
  userCurrencySymbol: "GH₵",
  baseCurrency: "GHS",
  convert: () => null,
  setUserCurrency: () => {},
  isDetecting: true,
  detectedCountry: null,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const { data: geo, isLoading: geoLoading } = useGeoLocation();
  const [userCurrency, setUserCurrencyState] = useState<string>(() => {
    return localStorage.getItem("preferred_currency") || "GHS";
  });

  const baseCurrency = "GHS";
  const { data: rates } = useExchangeRates(baseCurrency);

  useEffect(() => {
    if (geo?.currencyCode && !localStorage.getItem("preferred_currency")) {
      setUserCurrencyState(geo.currencyCode);
    }
  }, [geo]);

  const setUserCurrency = (code: string) => {
    setUserCurrencyState(code);
    localStorage.setItem("preferred_currency", code);
  };

  const convert = (amount: number, fromCurrency?: string) => {
    const from = fromCurrency || baseCurrency;
    if (from.toUpperCase() === userCurrency.toUpperCase()) return null;
    // If from isn't the base currency, we can't convert directly
    if (from.toUpperCase() !== baseCurrency.toUpperCase()) return null;
    return convertPrice(amount, from, userCurrency, rates);
  };

  return (
    <CurrencyContext.Provider
      value={{
        userCurrency,
        userCurrencySymbol: getCurrencySymbol(userCurrency),
        baseCurrency,
        convert,
        setUserCurrency,
        isDetecting: geoLoading,
        detectedCountry: geo?.country || null,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
