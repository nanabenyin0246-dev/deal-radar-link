import { useQuery } from "@tanstack/react-query";

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  types: string[];
}

/** Get public holidays for a country in current year */
export const usePublicHolidays = (countryCode: string) => {
  const year = new Date().getFullYear();
  return useQuery({
    queryKey: ["public-holidays", countryCode, year],
    queryFn: async (): Promise<Holiday[]> => {
      const res = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode.toUpperCase()}`
      );
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!countryCode && countryCode.length === 2,
  });
};

export const COUNTRY_CODES: Record<string, string> = {
  Ghana: "GH",
  Nigeria: "NG",
  Kenya: "KE",
  "South Africa": "ZA",
  Senegal: "SN",
  Rwanda: "RW",
  Tanzania: "TZ",
  Uganda: "UG",
  Cameroon: "CM",
  Ethiopia: "ET",
  Egypt: "EG",
  Morocco: "MA",
};

export const calculateDeliveryDate = (
  shippingDays: number,
  holidays: Holiday[],
): { date: Date; dateStr: string; businessDays: number } => {
  const holidayDates = new Set(holidays.map((h) => h.date));
  const current = new Date();
  let businessDaysAdded = 0;

  while (businessDaysAdded < shippingDays) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split("T")[0];
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidayDates.has(dateStr);

    if (!isWeekend && !isHoliday) {
      businessDaysAdded++;
    }
  }

  return {
    date: current,
    dateStr: current.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
    }),
    businessDays: shippingDays,
  };
};

export const isTodayHoliday = (holidays: Holiday[]): Holiday | null => {
  const today = new Date().toISOString().split("T")[0];
  return holidays.find((h) => h.date === today) || null;
};
