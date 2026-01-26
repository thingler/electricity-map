import { useState, useContext, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MapPageContext from "../../store/MapPageContext";
import { useLanguage } from "../../store/LanguageContext";
import { analyticsEventTracker } from "../analyticsTracker";
import LocalizedLink from "../LocalizedLink";

import Nav from "./Nav";

import css from "./Header.module.css";

const languages = [
  { code: "bs", label: "Bosanski" },
  { code: "bg", label: "Български" },
  { code: "cnr", label: "Crnogorski" },
  { code: "cs", label: "Čeština" },
  { code: "da", label: "Dansk" },
  { code: "de", label: "Deutsch" },
  { code: "et", label: "Eesti" },
  { code: "el", label: "Ελληνικά" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "ga", label: "Gaeilge" },
  { code: "hr", label: "Hrvatski" },
  { code: "is", label: "Íslenska" },
  { code: "it", label: "Italiano" },
  { code: "lv", label: "Latviešu" },
  { code: "lb", label: "Lëtzebuergesch" },
  { code: "lt", label: "Lietuvių" },
  { code: "hu", label: "Magyar" },
  { code: "mk", label: "Македонски" },
  { code: "mt", label: "Malti" },
  { code: "nl", label: "Nederlands" },
  { code: "no", label: "Norsk" },
  { code: "pl", label: "Polski" },
  { code: "pt", label: "Português" },
  { code: "ro", label: "Română" },
  { code: "rm", label: "Rumantsch" },
  { code: "ru", label: "Русский" },
  { code: "sq", label: "Shqip" },
  { code: "sk", label: "Slovenčina" },
  { code: "sl", label: "Slovenščina" },
  { code: "sr", label: "Српски" },
  { code: "fi", label: "Suomi" },
  { code: "sv", label: "Svenska" },
  { code: "tr", label: "Türkçe" },
  { code: "uk", label: "Українська" },
];

const supportedLangCodes = languages.map(l => l.code).filter(c => c !== "en");

function Header() {
  const { t } = useTranslation();
  const gaEventTracker = analyticsEventTracker("Menu");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const mapPageCtx = useContext(MapPageContext);
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleMenu() {
    gaEventTracker("header hamburger");
    setMenuIsOpen(!menuIsOpen);
  }

  function closeMenu() {
    setMenuIsOpen(false);
  }

  function logoClicked() {
    gaEventTracker(`header logo`);
  }

  function switchLanguage(newLang) {
    gaEventTracker(`language switch to ${newLang}`);
    const currentPath = location.pathname;

    // Remove current language prefix if present
    let pathWithoutLang = currentPath;

    for (const langCode of supportedLangCodes) {
      if (currentPath.startsWith(`/${langCode}/`)) {
        pathWithoutLang = currentPath.slice(langCode.length + 1);
        break;
      }
      if (currentPath === `/${langCode}`) {
        pathWithoutLang = "/";
        break;
      }
    }

    // Add new language prefix if not English
    let newPath;
    if (newLang === "en") {
      newPath = pathWithoutLang;
    } else {
      newPath = `/${newLang}${pathWithoutLang}`;
    }

    setLangDropdownOpen(false);
    navigate(newPath);
  }

  const header = mapPageCtx.isMapPage
    ? `${css.header} ${css.headerMapPage}`
    : css.header;

  return (
    <header className={menuIsOpen ? `${header} ${css.menuIsOpen}` : header}>
      <div className={css.flexContainer}>
        <div className={css.logo}>
          <LocalizedLink
            aria-label={t("header.logoAria")}
            onClick={logoClicked}
            to="/map"
          >
            Thingler
          </LocalizedLink>
        </div>
        {!menuIsOpen && <Nav layout="Header" closeMenu={closeMenu} />}
        <div className={css.languageSwitcher} ref={dropdownRef}>
          <button
            className={css.langButton}
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            aria-expanded={langDropdownOpen}
            aria-haspopup="true"
          >
            {lang.toUpperCase()}
            <span className={css.langArrow}>▼</span>
          </button>
          {langDropdownOpen && (
            <div className={css.langDropdown}>
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`${css.langOption} ${lang === language.code ? css.langOptionActive : ""}`}
                  onClick={() => switchLanguage(language.code)}
                >
                  {language.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className={css.menuIcon}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={css.navIcon}></span>
        </button>
      </div>
      {menuIsOpen && (
        <Nav
          layout="Header"
          closeMenu={closeMenu}
          showLanguages={true}
          currentLang={lang}
          languages={languages}
          onLanguageChange={switchLanguage}
        />
      )}
    </header>
  );
}

export default Header;
