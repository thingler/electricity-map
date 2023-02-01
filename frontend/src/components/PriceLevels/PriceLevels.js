import EnergyPriceLevels from "../EnergyPriceLevels";
import classes from "./PriceLevels.module.css";

function PriceLevels() {
  const priceLevels = EnergyPriceLevels();

  return (
    <div className={classes.energyPriceLevels}>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.trivial}`} />
        {`≤ ${priceLevels.low / 10}`} c / kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.low}`} />
        &gt; {priceLevels.low / 10} c / kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.medium}`} />
        &gt; {priceLevels.medium / 10} c / kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.concerning}`} />
        &gt; {priceLevels.concerning / 10} c / kWh
      </div>
      <div className={classes.level}>
        <span className={`${classes.dot} ${classes.high}`} />
        &gt; {priceLevels.high / 10} c / kWh
      </div>
    </div>
  );
}

export default PriceLevels;
