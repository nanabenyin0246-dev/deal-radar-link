import { useQuery } from "@tanstack/react-query";

export interface GeoData {
  country: string;
  countryCode: string;
  city: string;
  currencyCode: string;
  currencySymbol: string;
  timezone: string;
}

export const useGeoLocation = () => {
  return useQuery<GeoData>({
    queryKey: ["geo-location"],
    queryFn: async () => {
      try {
        const res = await fetch("https://ipwho.is/");
        if (!res.ok) throw new Error("IPWho failed");
        const data = await res.json();
        if (!data.success) throw new Error("IPWho lookup failed");
        return {
          country: data.country,
          countryCode: data.country_code,
          city: data.city,
          currencyCode: data.currency?.code || "GHS",
          currencySymbol: data.currency?.symbol || "GH₵",
          timezone: data.timezone?.id || "Africa/Accra",
        };
      } catch {
        // Fallback to IPWhois
        const res = await fetch("https://ipwhois.app/json/");
        if (!res.ok) throw new Error("Geo detection failed");
        const data = await res.json();
        return {
          country: data.country,
          countryCode: data.country_code,
          city: data.city,
          currencyCode: data.currency_code || "GHS",
          currencySymbol: data.currency_symbol || "GH₵",
          timezone: data.timezone || "Africa/Accra",
        };
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });
};
