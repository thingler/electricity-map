import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../store/LanguageContext";

const BASE_URL = "https://thingler.io";

const supportedLangs = [
  "en", "fi", "sv", "sq", "bs", "bg", "hr", "cs", "da", "nl",
  "et", "fr", "de", "el", "hu", "is", "ga", "it", "lv", "lt",
  "lb", "mk", "mt", "cnr", "no", "pl", "pt", "ro", "rm", "ru",
  "sr", "sk", "sl", "es", "tr", "uk",
];

function getPagePath(pathname) {
  // Strip language prefix to get the base page path
  const parts = pathname.split("/").filter(Boolean);
  const lang = supportedLangs.includes(parts[0]) && parts[0] !== "en" ? parts[0] : null;
  const pathParts = lang ? parts.slice(1) : parts;

  // Remove date suffix from /map/YYYY-MM-DD or /country/Name/YYYY-MM-DD
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart && /^\d{4}-\d{2}-\d{2}$/.test(lastPart)) {
    pathParts.pop();
  }

  return "/" + pathParts.join("/");
}

function HeadLinks() {
  const location = useLocation();
  const { lang } = useLanguage();

  useEffect(() => {
    const pagePath = getPagePath(location.pathname);
    const langPrefix = lang === "en" ? "" : `/${lang}`;
    const canonicalUrl = `${BASE_URL}${langPrefix}${pagePath}`;

    // Update or create canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // Remove existing hreflang links
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

    // Add hreflang links for all languages
    for (const l of supportedLangs) {
      const prefix = l === "en" ? "" : `/${l}`;
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", l);
      link.setAttribute("href", `${BASE_URL}${prefix}${pagePath}`);
      document.head.appendChild(link);
    }

    // Add x-default pointing to English
    const xDefault = document.createElement("link");
    xDefault.setAttribute("rel", "alternate");
    xDefault.setAttribute("hreflang", "x-default");
    xDefault.setAttribute("href", `${BASE_URL}${pagePath}`);
    document.head.appendChild(xDefault);
  }, [location.pathname, lang]);

  return null;
}

export default HeadLinks;
