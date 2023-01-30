import { useContext } from "react";

import BzPriceContext from "../../store/BzPriceContext";

import BiddingZoneList from "../BiddingZoneList";

import Country from "./Country";
import DateSelector from "../DateSelector/DateSelector";
import css from "./EuropeMapDetails.module.css";

function EuropeMapDetails() {
  const bzPriceCtx = useContext(BzPriceContext);
  const biddingZoneList = BiddingZoneList();

  const countries = biddingZoneList.reduce((previous, zone) => {
    if (
      zone.bz in bzPriceCtx.bzPrice &&
      bzPriceCtx.bzPrice[zone.bz].length > 0
    ) {
      const finalPrice = bzPriceCtx.bzPrice[zone.bz].reduce(
        (previous, bz) =>
          bz.resolution === "PT60M"
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
        });
      }
    }
    return previous;
  }, {});

  const countryJSX = Object.keys(countries)
    .sort()
    .map(
      (countryName, index) => (
        <Country
          key={index}
          first={index === 0}
          name={countryName}
          country={countries[countryName]}
        />
      ),
      []
    );

  return (
    <section>
      <h1>Electricity prices</h1>
      <p className={css.description}>
        This page presents the daily average prices, tax-free, for European
        countries that are members of ENTSO-E - European Network of Transmission
        System Operators for Electricity. The prices are displayed in Central
        European time (<b>CET/CEST</b>) and are expressed in Euro cents per
        kilowatt-hour.
      </p>
      <DateSelector />
      {countryJSX.length === 0 && (
        <>
          Please be aware that the day-ahead prices for <b>tomorrow</b> are{" "}
          <b>not yet available</b>!
        </>
      )}
      {countryJSX.length > 0 && (
        <div className={css.priceContainer}>
          <div className={`${css.country} ${css.header}`}>
            <div className={css.name}>Country</div>
            <div className={css.price}>€ cent / kWh</div>
          </div>
          {countryJSX}
        </div>
      )}
    </section>
  );
}

export default EuropeMapDetails;
