import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import translations, { Locale, SUPPORTED_LOCALES } from "./translations";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
  dir: "ltr",
});

export const useI18n = () => useContext(I18nContext);

const detectLocale = (): Locale => {
  const saved = localStorage.getItem("robcompare_locale");
  if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) return saved as Locale;

  const browserLang = navigator.language?.slice(0, 2);
  const match = SUPPORTED_LOCALES.find((l) => l.code === browserLang);
  return match?.code || "en";
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("robcompare_locale", l);
    document.documentElement.lang = l;
    const dir = SUPPORTED_LOCALES.find((s) => s.code === l)?.dir === "rtl" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    const dir = SUPPORTED_LOCALES.find((s) => s.code === locale)?.dir === "rtl" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
  }, [locale]);

  const t = useCallback(
    (key: string): string => {
      const dict = translations[locale] as Record<string, string>;
      return dict[key] || translations.en[key as keyof typeof translations.en] || key;
    },
    [locale]
  );

  const dir = SUPPORTED_LOCALES.find((s) => s.code === locale)?.dir === "rtl" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};
