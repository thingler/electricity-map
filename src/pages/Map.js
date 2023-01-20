import { useContext } from "react";
import MapPageContext from "../store/MapPageContext";

import EuropeMap from "../components/EuropeMap/Map";
import EuropeMapDetails from "../components/EuropeMapDetails/EuropeMapDetails";
import classes from "./Map.module.css";

function MapPage() {
  const mapPageCtx = useContext(MapPageContext);
  mapPageCtx.setMapPage(true);

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
