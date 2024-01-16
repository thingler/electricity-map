import EnergyPriceLevels from "../EnergyPriceLevels";
import classes from "./PriceLevels.module.css";

function PriceLevels(props) {
  const priceLevels = EnergyPriceLevels(props.vat);

  return (
    <div className={classes.energyPriceLevels}>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.trivial}`} />
        {`≤ ${Math.round(priceLevels.low / 10)}`} c/kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.low}`} />
        &gt; {Math.round(priceLevels.low / 10)} c/kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.medium}`} />
        &gt; {Math.round(priceLevels.medium / 10)} c/kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.concerning}`} />
        &gt; {Math.round(priceLevels.concerning / 10)} c/kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.high}`} />
        &gt; {Math.round(priceLevels.high / 10)} c/kWh
      </div>
    </div>
  );
}

export default PriceLevels;
