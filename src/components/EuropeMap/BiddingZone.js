import { Link } from "react-router-dom";
import css from "./BiddingZone.module.css";

function Header(props) {
  let price = props.children;
  let className = null;

  if (price <= 50) {
    className = css.trivial;
  }
  if (price > 50) {
    className = css.low;
  }
  if (price > 120) {
    className = css.medium;
  }
  if (price > 200) {
    className = css.concerning;
  }
  if (price > 400) {
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

export default Header;
