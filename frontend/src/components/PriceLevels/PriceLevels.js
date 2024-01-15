import EnergyPriceLevels from "../EnergyPriceLevels";
import classes from "./PriceLevels.module.css";

function PriceLevels(props) {
  const priceLevels = EnergyPriceLevels();

  return (
    <div className={classes.energyPriceLevels}>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.trivial}`} />
        {`≤ ${Math.round((priceLevels.low * props.vat) / 10)}`} c/kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.low}`} />
        &gt; {Math.round((priceLevels.low * props.vat) / 10)} c/kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.medium}`} />
        &gt; {Math.round((priceLevels.medium * props.vat) / 10)} c/kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.concerning}`} />
        &gt; {Math.round((priceLevels.concerning * props.vat) / 10)} c/kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.high}`} />
        &gt; {Math.round((priceLevels.high * props.vat) / 10)} c/kWh
      </div>
    </div>
  );
}

export default PriceLevels;
