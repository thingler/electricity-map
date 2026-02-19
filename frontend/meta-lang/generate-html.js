"use strict";

const fs = require("fs");
const path = require("path");
const translations = require("./translations");

// Configuration
const BUILD_DIR = path.join(__dirname, "../build");
const BASE_URL = "https://thingler.io";
const IMAGE_URL = "https://thingler.io/map.jpg";

const supportedLangs = [
  "en",
  "fi",
  "sv",
  "sq",
  "bs",
  "bg",
  "hr",
  "cs",
  "da",
  "nl",
  "et",
  "fr",
  "de",
  "el",
  "hu",
  "is",
  "ga",
  "it",
  "lv",
  "lt",
  "lb",
  "mk",
  "mt",
  "cnr",
  "no",
  "pl",
  "pt",
  "ro",
  "rm",
  "ru",
  "sr",
  "sk",
  "sl",
  "es",
  "tr",
  "uk",
];

const countries = [
  "Albania",
  "Austria",
  "Belgium",
  "Bosnia-Hertsegovina",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Luxembourg",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Kosovo",
  "Latvia",
  "Lithuania",
  "Malta",
  "Moldova",
  "Montenegro",
  "Netherlands",
  "North Macedonia",
  "Northern Ireland",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Turkey",
  "Ukraine",
  "United Kingdom",
];

function getTranslation(lang, key) {
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  if (translations.en && translations.en[key]) {
    return translations.en[key];
  }
  return key;
}

function getCountryName(lang, country) {
  const key = `country.${country}`;
  const name = getTranslation(lang, key);
  return name === key ? country : name;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateHreflangTags(pagePath) {
  const tags = supportedLangs.map((l) => {
    const prefix = l === "en" ? "" : `/${l}`;
    return `<link rel="alternate" hreflang="${l}" href="${BASE_URL}${prefix}${pagePath}"/>`;
  });
  // x-default points to the English version
  tags.push(
    `<link rel="alternate" hreflang="x-default" href="${BASE_URL}${pagePath}"/>`,
  );
  return tags.join("");
}

function injectMeta(html, title, description, url, lang, hreflangTags) {
  const canonical = `<link rel="canonical" href="${escapeHTML(url)}"/>`;
  const metaTags = `<meta charset="utf-8"/><title>${escapeHTML(title)}</title>${canonical}${hreflangTags}<meta property="og:url" content="${escapeHTML(url)}"/><meta property="og:type" content="website"/><meta property="og:title" content="${escapeHTML(title)}"/><meta property="og:description" content="${escapeHTML(description)}"/><meta property="og:image" content="${IMAGE_URL}"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta name="twitter:card" content="summary_large_image"/><meta property="twitter:domain" content="thingler.io"/><meta property="twitter:url" content="${escapeHTML(url)}"/><meta name="twitter:title" content="${escapeHTML(title)}"/><meta name="twitter:description" content="${escapeHTML(description)}"/><meta name="twitter:image" content="${IMAGE_URL}"/><meta name="twitter:image:width" content="1200"/><meta name="twitter:image:height" content="630"/><meta name="description" content="${escapeHTML(description)}"/>`;

  // Set html lang attribute
  html = html.replace(/<html\s+lang=["'][^"']*["']/i, `<html lang="${lang}"`);

  // Remove existing charset and title tags
  html = html.replace(/<meta\s+charset=["'][^"']*["']\s*\/?>/gi, "");
  html = html.replace(/<title>[^<]*<\/title>/gi, "");

  // Remove existing og/twitter meta tags
  html = html.replace(
    /<meta\s+(?:property|name)=["'](?:og:|twitter:)[^"']*["'][^>]*>/gi,
    "",
  );

  // Remove existing description meta tag
  html = html.replace(/<meta[^>]*name=["']description["'][^>]*>/gi, "");

  // Remove existing canonical and hreflang tags
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "");
  html = html.replace(/<link\s+rel=["']alternate["'][^>]*hreflang[^>]*>/gi, "");

  // Insert after <head>
  html = html.replace(/(<head[^>]*>)/i, `$1${metaTags}`);

  return html;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generatePages() {
  const sourceHtml = fs.readFileSync(
    path.join(BUILD_DIR, "index.html"),
    "utf8",
  );
  let filesGenerated = 0;

  for (const lang of supportedLangs) {
    const langPrefix = lang === "en" ? "" : `/${lang}`;
    const langDir = lang === "en" ? BUILD_DIR : path.join(BUILD_DIR, lang);

    // Map page
    {
      const title = getTranslation(lang, "title.map");
      const description = getTranslation(lang, "description.map");
      const url = `${BASE_URL}${langPrefix}/map`;
      const hreflangTags = generateHreflangTags("/map");
      const html = injectMeta(sourceHtml, title, description, url, lang, hreflangTags);

      if (lang === "en") {
        // For English, write to root index.html
        fs.writeFileSync(path.join(BUILD_DIR, "index.html"), html);
      } else {
        ensureDir(langDir);
        fs.writeFileSync(path.join(langDir, "index.html"), html);
      }
      filesGenerated++;
    }

    // About page
    {
      const title = getTranslation(lang, "title.about");
      const description = getTranslation(lang, "description.about");
      const url = `${BASE_URL}${langPrefix}/about`;
      const hreflangTags = generateHreflangTags("/about");
      const html = injectMeta(sourceHtml, title, description, url, lang, hreflangTags);

      const aboutDir = path.join(langDir, "about");
      ensureDir(aboutDir);
      fs.writeFileSync(path.join(aboutDir, "index.html"), html);
      filesGenerated++;
    }

    // Country pages
    for (const country of countries) {
      const countryName = getCountryName(lang, country);
      const title = getTranslation(lang, "title.country").replace(
        "{{country}}",
        countryName,
      );
      const description = getTranslation(lang, "description.country").replace(
        "{{country}}",
        countryName,
      );
      const encodedCountry = encodeURIComponent(country);
      const url = `${BASE_URL}${langPrefix}/country/${encodedCountry}`;
      const hreflangTags = generateHreflangTags(`/country/${encodedCountry}`);
      const html = injectMeta(sourceHtml, title, description, url, lang, hreflangTags);

      const countryDir = path.join(langDir, "country", country);
      ensureDir(countryDir);
      fs.writeFileSync(path.join(countryDir, "index.html"), html);
      filesGenerated++;
    }
  }

  console.log(`Generated ${filesGenerated} HTML files`);
}

// Run
generatePages();
