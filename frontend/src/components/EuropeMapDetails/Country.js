import { Link } from "react-router-dom";

import EnergyPriceLevels from "../../components/EnergyPriceLevels";

import css from "./EuropeMapDetails.module.css";

function Country(props) {
  const priceLevels = EnergyPriceLevels();

  function BiddingZone(bz) {
    return (
      <div className={bz.countryClass}>
        <div className={bz.nameClass}>
          <span className={bz.dotClass} />
          <Link to={`/country/${props.name}`}>{bz.biddingZone}</Link>
        </div>
        <div className={bz.priceClass}>{bz.price}</div>
        <div className={bz.vatClass}>{bz.vat}</div>
      </div>
    );
  }

  function getPriceClass(price, vat) {
    let priceClass = null;

    if (price <= priceLevels.low) {
      priceClass = css.trivial;
    }
    if (price > priceLevels.low) {
      priceClass = css.low;
    }
    if (price > priceLevels.medium) {
      priceClass = css.medium;
    }
    if (price > priceLevels.concerning) {
      priceClass = css.concerning;
    }
    if (price > priceLevels.high) {
      priceClass = css.high;
    }
    if (price === null) {
      priceClass = css.noPriceData;
    } else {
      price = (Math.round(price * 10 * (vat / 100 + 1)) / 100).toFixed(2);
    }
    return { price: price, priceClass: priceClass };
  }

  if (props.country.length === 1) {
    const priceData = getPriceClass(
      props.country[0].averagePrice,
      props.country[0].vat
    );
    return (
      <div className={css.countryContainer}>
        <hr className={props.first ? css.hiddenHr : css.hr} />
        <div className={css.country}>
          <div className={css.name}>
            <span className={`${css.dot} ${priceData.priceClass}`} />
            <Link to={`/country/${props.name}`}>{props.name}</Link>
          </div>
          <div className={css.price}>{priceData.price}</div>
          <div className={css.vat}>{props.country[0].vat}</div>
        </div>
      </div>
    );
  } else {
    const biddingZones = props.country.map((zone, index) => {
      const priceData = getPriceClass(zone.averagePrice, zone.vat);
      return (
        <BiddingZone
          key={index}
          countryClass={`${css.country} ${css.countryWithBZs}`}
          nameClass={css.name}
          dotClass={`${css.dot} ${css.dotWithBZs} ${priceData.priceClass}`}
          priceClass={css.price}
          vatClass={css.vat}
          biddingZone={zone.description}
          price={priceData.price}
          vat={zone.vat}
        />
      );
    });
    return (
      <div className={css.countryContainer}>
        <hr className={props.first ? css.hiddenHr : css.hr} />
        <div className={css.country}>
          <div className={`${css.name} ${css.nameWithBZs}`}>
            <Link to={`/country/${props.name}`}>{props.name}</Link>
          </div>
        </div>
        {biddingZones}
      </div>
    );
  }
}

export default Country;
