import { createContext, useContext, ReactNode, useMemo } from "react";
import { useAllCountries, CountryData } from "@/hooks/useRestCountries";

interface CountryContextType {
  /** Lookup country by cca2 code (e.g. "GH") or full name (e.g. "Ghana") */
  getCountry: (codeOrName: string) => CountryData | undefined;
  isLoading: boolean;
}

const CountryContext = createContext<CountryContextType>({
  getCountry: () => undefined,
  isLoading: true,
});

export const useCountryLookup = () => useContext(CountryContext);

export const CountryProvider = ({ children }: { children: ReactNode }) => {
  const { data: countries, isLoading } = useAllCountries();

  const lookup = useMemo(() => {
    if (!countries) return { byCode: new Map<string, CountryData>(), byName: new Map<string, CountryData>() };
    const byCode = new Map<string, CountryData>();
    const byName = new Map<string, CountryData>();
    for (const c of countries) {
      byCode.set(c.code.toUpperCase(), c);
      byName.set(c.name.toLowerCase(), c);
    }
    return { byCode, byName };
  }, [countries]);

  const getCountry = (codeOrName: string): CountryData | undefined => {
    if (!codeOrName) return undefined;
    const upper = codeOrName.toUpperCase();
    if (upper.length <= 3) return lookup.byCode.get(upper);
    return lookup.byName.get(codeOrName.toLowerCase()) || lookup.byCode.get(upper);
  };

  return (
    <CountryContext.Provider value={{ getCountry, isLoading }}>
      {children}
    </CountryContext.Provider>
  );
};
