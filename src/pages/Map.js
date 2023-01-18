import EuropeMap from "../components/EuropeMap/Map";
import EuropeMapDetails from "../components/EuropeMapDetails/EuropeMapDetails";
import classes from "./Map.module.css";

function MapPage() {
  return (
    <div className={classes.flexContainer}>
      <div className={classes.map}>
        <EuropeMap />
      </div>
      <div className={classes.text}>
        <EuropeMapDetails />
      </div>
    </div>
  );
}

export default MapPage;
