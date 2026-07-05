"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Language = "np" | "en";

const COOKIE_KEY = "language";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export default function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language;
  children: ReactNode;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next: Language = prev === "np" ? "en" : "np";
      document.cookie = `${COOKIE_KEY}=${next}; path=/; max-age=${COOKIE_MAX_AGE}`;
      return next;
    });
  }, []);

  const value = useMemo(() => ({ language, toggleLanguage }), [language, toggleLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
