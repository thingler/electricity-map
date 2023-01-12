import css from "./EuropeMapDetails.module.css";

function Country(props) {
  function BiddingZone(bz) {
    return (
      <div className={bz.countryClass}>
        <div className={bz.nameClass}>
          <span className={bz.dotClass} />
          {bz.biddingZone}
        </div>
        <div className={bz.priceClass}>{bz.price}</div>
      </div>
    );
  }

  function getPriceClass(price) {
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
    return { price: price, priceClass: priceClass };
  }

  if (props.country.length === 1) {
    const priceData = getPriceClass(props.country[0].averagePrice);
    return (
      <div className={css.countryContainer}>
        <div className={css.country}>
          <div className={css.name}>
            <span className={`${css.dot} ${priceData.priceClass}`} />
            {props.name}
          </div>
          <div className={css.price}>{priceData.price}</div>
        </div>
      </div>
    );
  } else {
    const biddingZones = props.country.map((zone, index) => {
      const priceData = getPriceClass(zone.averagePrice);
      return (
        <BiddingZone
          key={index}
          countryClass={`${css.country} ${css.countryWithBZs}`}
          nameClass={css.name}
          dotClass={`${css.dot} ${css.dotWithBZs} ${priceData.priceClass}`}
          priceClass={css.price}
          biddingZone={zone.biddingZone.replace("BZN|", "")}
          price={priceData.price}
        />
      );
    });
    return (
      <div className={css.countryContainer}>
        <div className={css.country}>
          <div className={`${css.name} ${css.nameWithBZs}`}>{props.name}</div>
        </div>
        {biddingZones}
      </div>
    );
  }
}

export default Country;
