import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  translations,
  type Language,
  type TranslationKey,
} from "../translations/translations";

// =====================================================
// TYPES
// =====================================================

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

// =====================================================
// CONTEXT
// =====================================================

const LanguageContext =
  createContext<LanguageContextType | undefined>(
    undefined
  );

// =====================================================
// STORAGE KEY
// =====================================================

const SETTINGS_STORAGE_KEY = "tagit-settings";

// =====================================================
// PROVIDER
// =====================================================

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("English");

  // ===================================================
  // LOAD SAVED LANGUAGE
  // ===================================================

  useEffect(() => {
    try {
      const savedSettings =
        localStorage.getItem(
          SETTINGS_STORAGE_KEY
        );

      if (savedSettings) {
        const data = JSON.parse(savedSettings);

        if (
          data.language === "English" ||
          data.language === "Tamil" ||
          data.language === "Hindi"
        ) {
          setLanguageState(data.language);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load language:",
        error
      );
    }
  }, []);

  // ===================================================
  // CHANGE LANGUAGE
  // ===================================================

  const setLanguage = (
    newLanguage: Language
  ) => {
    setLanguageState(newLanguage);

    try {
      const savedSettings =
        localStorage.getItem(
          SETTINGS_STORAGE_KEY
        );

      const currentSettings = savedSettings
        ? JSON.parse(savedSettings)
        : {};

      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          ...currentSettings,
          language: newLanguage,
        })
      );
    } catch (error) {
      console.error(
        "Failed to save language:",
        error
      );
    }
  };

  // ===================================================
  // TRANSLATION FUNCTION
  // ===================================================

  const t = (key: TranslationKey) => {
    return (
      translations[language][key] ??
      translations.English[key] ??
      key
    );
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}