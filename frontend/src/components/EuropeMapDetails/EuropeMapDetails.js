import { useContext } from "react";
import { useTranslation, Trans } from "react-i18next";

import BzPriceContext from "../../store/BzPriceContext";
import VATContext from "../../store/VATContext";
import { countryList } from "../../components/countryList";
import VatToggle from "../../components/VatToggle/VatToggle";

import BiddingZoneList from "../BiddingZoneList";

import Country from "./Country";
import DateSelector from "../DateSelector/DateSelector";
import css from "./EuropeMapDetails.module.css";

function EuropeMapDetails() {
  const { t } = useTranslation();
  const bzPriceCtx = useContext(BzPriceContext);
  const vatCtx = useContext(VATContext);
  const biddingZoneList = BiddingZoneList();

  const countries = biddingZoneList.reduce((previous, zone) => {
    if (
      zone.bz in bzPriceCtx.bzPrice &&
      bzPriceCtx.bzPrice[zone.bz].length > 0
    ) {
      let resolution = "PT60M";
      if (bzPriceCtx.bzPrice[zone.bz].length > 24) {
        resolution = "PT15M";
      }
      const finalPrice = bzPriceCtx.bzPrice[zone.bz].reduce(
        (previous, bz) =>
          bz.resolution === resolution
            ? {
                sum: previous.sum + bz.price,
                elements: previous.elements + 1,
              }
            : previous,
        { sum: 0, elements: 0 }
      );
      if (finalPrice.elements > 0) {
        if (!(zone.country in previous)) {
          previous[zone.country] = [];
        }
        previous[zone.country].push({
          biddingZone: zone.bz,
          description: zone.description,
          averagePrice: finalPrice.sum / finalPrice.elements,
          vat: vatCtx.vat ? countryList[zone.country].vat : 0,
        });
      }
    }
    return previous;
  }, {});

  const countryJSX = Object.keys(countries)
    .sort((a, b) => {
      const nameA = t(`countries.${a}`, a);
      const nameB = t(`countries.${b}`, b);
      return nameA.localeCompare(nameB);
    })
    .map(
      (countryName, index) => (
        <Country
          key={index}
          first={index === 0}
          name={countryName}
          country={countries[countryName]}
          priceLevelVAT={vatCtx.vat ? 1.21 : 1}
        />
      ),
      []
    );

  return (
    <section>
      <h1>{t("europeMapDetails.title")}</h1>
      <p className={css.description}>
        <Trans i18nKey="europeMapDetails.description" components={{ b: <b /> }} />
      </p>
      <div className={css.actionContainer}>
        <div className={css.vatSelector}>
          <VatToggle />
        </div>
        <div className={css.dateSelector}>
          <DateSelector />
        </div>
      </div>
      {countryJSX.length === 0 && (
        <Trans i18nKey="europeMapDetails.noPricesAvailable" components={{ b: <b /> }} />
      )}
      {countryJSX.length > 0 && (
        <div className={css.priceContainer}>
          <div className={`${css.country} ${css.header}`}>
            <div className={css.name}>{t("europeMapDetails.country")}</div>
            <div className={css.price}>{t("europeMapDetails.priceUnit")}</div>
            <div className={css.vat}>{t("europeMapDetails.vat")}</div>
          </div>
          {countryJSX}
        </div>
      )}
    </section>
  );
}

export default EuropeMapDetails;
