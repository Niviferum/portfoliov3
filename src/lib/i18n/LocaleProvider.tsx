"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { dictionaries, type Dictionary, type Locale } from "./dictionary";
import * as store from "./localeStore";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  // `<html lang>` est figé au build par l'export statique : il doit être
  // réaffecté impérativement à chaque changement de langue (RGAA 8.4).
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => store.setLocale(next), []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dict: dictionaries[locale],
      setLocale,
      toggleLocale: () => setLocale(locale === "fr" ? "en" : "fr"),
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale doit être utilisé dans un <LocaleProvider>.");
  }
  return ctx;
}
