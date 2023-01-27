import { Link } from "react-router-dom";

import EnergyPriceLevels from "../../components/EnergyPriceLevels";

import css from "./BiddingZone.module.css";

function BiddingZone(props) {
  const priceLevels = EnergyPriceLevels();

  let price = props.children;
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
    <Link to={`/country/${props.country}`}>
      <path className={className} d={props.d} />
      {price !== null && (
        <text x={props.textX} y={props.textY}>
          {price}
        </text>
      )}
    </Link>
  );
}

export default BiddingZone;
