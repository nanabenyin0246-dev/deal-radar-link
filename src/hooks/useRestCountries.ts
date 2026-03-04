import { useQuery } from "@tanstack/react-query";

export interface CountryData {
  name: string;
  code: string; // cca2
  flag: string; // emoji
  currencies: { code: string; name: string; symbol: string }[];
  callingCode: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
}

const REST_COUNTRIES_API = "https://restcountries.com/v3.1";

const parseCountry = (c: any): CountryData => {
  const currencies = c.currencies
    ? Object.entries(c.currencies).map(([code, val]: [string, any]) => ({
        code,
        name: val.name,
        symbol: val.symbol || code,
      }))
    : [];

  return {
    name: c.name?.common || "",
    code: c.cca2 || "",
    flag: c.flag || "",
    currencies,
    callingCode: c.idd?.root
      ? `${c.idd.root}${c.idd.suffixes?.[0] || ""}`
      : "",
    capital: c.capital?.[0] || "",
    region: c.region || "",
    subregion: c.subregion || "",
    population: c.population || 0,
  };
};

export const useAllCountries = () => {
  return useQuery({
    queryKey: ["rest-countries-all"],
    queryFn: async (): Promise<CountryData[]> => {
      const res = await fetch(
        `${REST_COUNTRIES_API}/all?fields=name,cca2,flag,currencies,idd,capital,region,subregion,population`
      );
      if (!res.ok) throw new Error("Failed to fetch countries");
      const data = await res.json();
      return data.map(parseCountry).sort((a: CountryData, b: CountryData) => a.name.localeCompare(b.name));
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache 24h
  });
};

export const useCountryByCode = (code: string) => {
  return useQuery({
    queryKey: ["rest-country", code],
    queryFn: async (): Promise<CountryData> => {
      const res = await fetch(`${REST_COUNTRIES_API}/alpha/${code}?fields=name,cca2,flag,currencies,idd,capital,region,subregion,population`);
      if (!res.ok) throw new Error("Country not found");
      const data = await res.json();
      return parseCountry(data);
    },
    enabled: !!code,
    staleTime: 24 * 60 * 60 * 1000,
  });
};
