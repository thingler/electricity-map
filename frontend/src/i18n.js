import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import fiTranslation from "./locales/fi/translation.json";
import svTranslation from "./locales/sv/translation.json";
import sqTranslation from "./locales/sq/translation.json";
import bsTranslation from "./locales/bs/translation.json";
import bgTranslation from "./locales/bg/translation.json";
import hrTranslation from "./locales/hr/translation.json";
import csTranslation from "./locales/cs/translation.json";
import daTranslation from "./locales/da/translation.json";
import nlTranslation from "./locales/nl/translation.json";
import etTranslation from "./locales/et/translation.json";
import frTranslation from "./locales/fr/translation.json";
import deTranslation from "./locales/de/translation.json";
import elTranslation from "./locales/el/translation.json";
import huTranslation from "./locales/hu/translation.json";
import isTranslation from "./locales/is/translation.json";
import gaTranslation from "./locales/ga/translation.json";
import itTranslation from "./locales/it/translation.json";
import lvTranslation from "./locales/lv/translation.json";
import ltTranslation from "./locales/lt/translation.json";
import lbTranslation from "./locales/lb/translation.json";
import mkTranslation from "./locales/mk/translation.json";
import mtTranslation from "./locales/mt/translation.json";
import cnrTranslation from "./locales/cnr/translation.json";
import noTranslation from "./locales/no/translation.json";
import plTranslation from "./locales/pl/translation.json";
import ptTranslation from "./locales/pt/translation.json";
import roTranslation from "./locales/ro/translation.json";
import rmTranslation from "./locales/rm/translation.json";
import ruTranslation from "./locales/ru/translation.json";
import srTranslation from "./locales/sr/translation.json";
import skTranslation from "./locales/sk/translation.json";
import slTranslation from "./locales/sl/translation.json";
import esTranslation from "./locales/es/translation.json";
import trTranslation from "./locales/tr/translation.json";
import ukTranslation from "./locales/uk/translation.json";

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: [
      "en", "fi", "sv", "sq", "bs", "bg", "hr", "cs", "da",
      "nl", "et", "fr", "de", "el", "hu", "is", "ga", "it", "lv",
      "lt", "lb", "mk", "mt", "cnr", "no", "pl", "pt", "ro", "rm",
      "ru", "sr", "sk", "sl", "es", "tr", "uk"
    ],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: enTranslation },
      fi: { translation: fiTranslation },
      sv: { translation: svTranslation },
      sq: { translation: sqTranslation },
      bs: { translation: bsTranslation },
      bg: { translation: bgTranslation },
      hr: { translation: hrTranslation },
      cs: { translation: csTranslation },
      da: { translation: daTranslation },
      nl: { translation: nlTranslation },
      et: { translation: etTranslation },
      fr: { translation: frTranslation },
      de: { translation: deTranslation },
      el: { translation: elTranslation },
      hu: { translation: huTranslation },
      is: { translation: isTranslation },
      ga: { translation: gaTranslation },
      it: { translation: itTranslation },
      lv: { translation: lvTranslation },
      lt: { translation: ltTranslation },
      lb: { translation: lbTranslation },
      mk: { translation: mkTranslation },
      mt: { translation: mtTranslation },
      cnr: { translation: cnrTranslation },
      no: { translation: noTranslation },
      pl: { translation: plTranslation },
      pt: { translation: ptTranslation },
      ro: { translation: roTranslation },
      rm: { translation: rmTranslation },
      ru: { translation: ruTranslation },
      sr: { translation: srTranslation },
      sk: { translation: skTranslation },
      sl: { translation: slTranslation },
      es: { translation: esTranslation },
      tr: { translation: trTranslation },
      uk: { translation: ukTranslation },
    },
  });

export default i18n;
