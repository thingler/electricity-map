import { useTranslation } from "react-i18next";
import EnergyPriceLevels from "../../components/EnergyPriceLevels";
import LocalizedLink from "../LocalizedLink";

import css from "./BiddingZone.module.css";

function BiddingZone(props) {
  const { t } = useTranslation();
  const priceLevels = EnergyPriceLevels(props.priceLevelVAT);
  const translatedCountry = t(`countries.${props.country}`, props.country);

  let price = props.children;
  if (price !== null) {
    price *= props.vat;
  }

  let className = null;

  if (price <= priceLevels.low) {
    className = css.trivial;
  }
  if (price > priceLevels.low) {
    className = css.low;
  }
  if (price > priceLevels.medium) {
    className = css.medium;
  }
  if (price > priceLevels.concerning) {
    className = css.concerning;
  }
  if (price > priceLevels.high) {
    className = css.high;
  }
  if (price === null) {
    className = css.noPriceData;
  } else {
    price = (Math.round(price * 10) / 100).toFixed(2);
  }

  return (
    <LocalizedLink
      aria-label={`${t("pageTitle.electricityPricesFor")}${translatedCountry}`}
      to={`/country/${props.country}`}
    >
      <path className={className} d={props.d} />
      {price !== null && (
        <text x={props.textX} y={props.textY}>
          {price}
        </text>
      )}
    </LocalizedLink>
  );
}

export default BiddingZone;
