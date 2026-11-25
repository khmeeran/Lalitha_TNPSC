"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type SupportedLanguage = "en" | "ta";

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  isTamil: boolean;
  t: (english: string, tamil?: string) => string;
}

const STORAGE_KEY = "tnpsc_wizard_lang";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 1. Load saved preference from localStorage (defaulting to English)
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved === "en" || saved === "ta") {
        setLanguageState(saved);
      }
    } catch {
      // LocalStorage unavailable, keep default 'en'
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // 2. Persist language choice
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage errors
    }

    // 3. Update DOM attributes and font enforcement class
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      if (language === "ta") {
        document.documentElement.classList.add("lang-ta");
        document.body.classList.add("font-tamil");
      } else {
        document.documentElement.classList.remove("lang-ta");
        document.body.classList.remove("font-tamil");
      }
    }
  }, [language, isHydrated]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "ta" : "en"));
  };

  const t = (english: string, tamil?: string): string => {
    if (language === "ta" && tamil && tamil.trim().length > 0) {
      return tamil;
    }
    return english;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isTamil: language === "ta",
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return safe fallback if rendered outside provider
    return {
      language: "en",
      setLanguage: () => {},
      toggleLanguage: () => {},
      isTamil: false,
      t: (english: string, _tamil?: string) => english,
    };
  }
  return context;
}
