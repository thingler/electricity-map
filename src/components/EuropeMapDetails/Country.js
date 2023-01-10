import css from "./EuropeMapDetails.module.css";

function Country(props) {
  var price = props.averagePrice;
  var priceClass = null;

  if (price <= 50) {
    priceClass = css.trivial;
  }
  if (price > 50) {
    priceClass = css.low;
  }
  if (price > 120) {
    priceClass = css.medium;
  }
  if (price > 200) {
    priceClass = css.concerning;
  }
  if (price > 400) {
    priceClass = css.high;
  }
  if (price === null) {
    priceClass = css.noPriceData;
  } else {
    price = (Math.round(price * 10) / 100).toFixed(2);
  }

  return (
    <div className={css.country}>
      <div className={css.name}>
        <span className={`${css.dot} ${priceClass}`} />
        {props.children}
      </div>
      <div className={css.price}>{price}</div>
    </div>
  );
}

export default Country;
