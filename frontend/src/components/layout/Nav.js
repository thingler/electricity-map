import { useState } from "react";
import { useTranslation } from "react-i18next";
import { analyticsEventTracker } from "../analyticsTracker";
import LocalizedLink from "../LocalizedLink";

import css from "./Nav.module.css";

function Nav(props) {
  const { t } = useTranslation();
  const gaEventTracker = analyticsEventTracker("Menu");
  const [showLangOptions, setShowLangOptions] = useState(false);

  function mapClicked() {
    gaEventTracker(`${props.layout} map`);
    if (props.closeMenu) {
      props.closeMenu();
    }
  }

  function aboutClicked() {
    gaEventTracker(`${props.layout} about`);
    if (props.closeMenu) {
      props.closeMenu();
    }
  }

  function handleLanguageClick(langCode) {
    if (props.onLanguageChange) {
      props.onLanguageChange(langCode);
    }
    if (props.closeMenu) {
      props.closeMenu();
    }
  }

  return (
    <nav>
      <ul>
        <li>
          <LocalizedLink onClick={mapClicked} to="/map">
            {t("nav.europeMap")}
          </LocalizedLink>
        </li>
        <li>
          <LocalizedLink onClick={aboutClicked} to="/about">
            {t("nav.about")}
          </LocalizedLink>
        </li>
        {props.showLanguages && (
          <li className={css.languageItem}>
            <button
              className={css.languageToggle}
              onClick={() => setShowLangOptions(!showLangOptions)}
            >
              {t("nav.language", "Language")}
              <span className={css.langArrow}>{showLangOptions ? "▲" : "▼"}</span>
            </button>
            {showLangOptions && (
              <ul className={css.languageList}>
                {props.languages.map((language) => (
                  <li key={language.code}>
                    <button
                      className={`${css.langOption} ${props.currentLang === language.code ? css.langOptionActive : ""}`}
                      onClick={() => handleLanguageClick(language.code)}
                    >
                      {language.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
