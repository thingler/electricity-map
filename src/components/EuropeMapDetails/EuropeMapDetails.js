import css from "./EuropeMapDetails.module.css";
function EuropeMapDetails() {
  return (
    <section>
      <h1>Electricity prices</h1>
      <div className={css.priceContainer}>
        <div className={`${css.country} ${css.header}`}>
          <div className={css.name}>Country</div>
          <div className={css.price}>€ cent / kWh</div>
        </div>

        <div className={css.country}>
          <div className={css.name}>
            <span className={`${css.dot} ${css.low}`} />
            Finland
          </div>
          <div className={css.price}>12,60</div>
        </div>
        <div className={css.country}>
          <div className={css.name}>
            <span className={`${css.dot} ${css.high}`} />
            Norway
          </div>
          <div className={css.price}>31,30</div>
        </div>
        <div className={css.country}>
          <div className={css.name}>
            <span className={`${css.dot} ${css.concerning}`} />
            Sweedend
          </div>
          <div className={css.price}>19,30</div>
        </div>
        <div className={css.country}>
          <div className={css.name}>
            <span className={`${css.dot} ${css.medium}`} />
            Denmark
          </div>
          <div className={css.price}>51,30</div>
        </div>
      </div>
    </section>
  );
}

export default EuropeMapDetails;
