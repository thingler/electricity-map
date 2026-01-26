import { createContext, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext({
  lang: "en",
  localizedPath: (path) => path,
});

const supportedLangs = [
  "fi", "sv", "sq", "bs", "bg", "hr", "cs", "da", "nl",
  "et", "fr", "de", "el", "hu", "is", "ga", "it", "lv", "lt",
  "lb", "mk", "mt", "cnr", "no", "pl", "pt", "ro", "rm", "ru",
  "sr", "sk", "sl", "es", "tr", "uk"
];

export function LanguageContextProvider({ children }) {
  const location = useLocation();
  const { i18n } = useTranslation();

  // Extract language from URL path
  const pathParts = location.pathname.split("/").filter(Boolean);
  const urlLang = supportedLangs.includes(pathParts[0]) ? pathParts[0] : "en";

  // Sync i18n language with URL
  if (i18n.language !== urlLang) {
    i18n.changeLanguage(urlLang);
  }

  // Helper to generate language-prefixed paths
  const localizedPath = (path) => {
    if (urlLang === "en") {
      return path;
    }
    // Ensure path starts with /
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `/${urlLang}${normalizedPath}`;
  };

  return (
    <LanguageContext.Provider value={{ lang: urlLang, localizedPath }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageContext;
