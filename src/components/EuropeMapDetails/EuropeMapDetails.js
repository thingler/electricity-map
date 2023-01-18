import { useContext } from "react";

import BzPriceContext from "../../store/BzPriceContext";

import BiddingZoneList from "../BiddingZoneList";

import Country from "./Country";
import css from "./EuropeMapDetails.module.css";

function EuropeMapDetails() {
  const bzPriceCtx = useContext(BzPriceContext);
  const biddingZoneList = BiddingZoneList();

  const countries = biddingZoneList.reduce((previous, zone) => {
    var averagePrice = null;
    if (
      zone.bz in bzPriceCtx.bzPrice &&
      bzPriceCtx.bzPrice[zone.bz].length > 0
    ) {
      if (!(zone.country in previous)) {
        previous[zone.country] = [];
      }
      var finalPrice = bzPriceCtx.bzPrice[zone.bz].reduce(
        (previous, bz) =>
          bz.resolution === "PT60M"
            ? {
                sum: previous.sum + bz.price,
                elements: previous.elements + 1,
              }
            : previous,
        { sum: 0, elements: 0 }
      );
      averagePrice = finalPrice.sum / finalPrice.elements;
      previous[zone.country].push({
        biddingZone: zone.bz,
        averagePrice,
      });
    }
    return previous;
  }, {});

  const countryJSX = Object.keys(countries)
    .sort()
    .map(
      (countryName, index) => (
        <Country
          key={index}
          name={countryName}
          country={countries[countryName]}
        />
      ),
      []
    );

  return (
    <section>
      <h1>Electricity prices</h1>
      <div className={css.priceContainer}>
        <div className={`${css.country} ${css.header}`}>
          <div className={css.name}>Country</div>
          <div className={css.price}>€ cent / kWh</div>
        </div>
        {countryJSX}
      </div>
    </section>
  );
}

export default EuropeMapDetails;
