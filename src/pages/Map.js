import { useState, useEffect } from "react";

import EuropeMap from "../components/EuropeMap/Map";
import EuropeMapDetails from "../components/EuropeMapDetails/EuropeMapDetails";
import classes from "./Map.module.css";

function MapPage() {
  const [bzPrice, setBzPrice] = useState({});
  useEffect(() => {
    const d = new Date();
    const now = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    fetch(`https://api.thingler.io/day-ahead?date=${now}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBzPrice(data);
      });
  }, []);

  return (
    <div className={classes.flexContainer}>
      <div className={classes.map}>
        <EuropeMap bzPrice={bzPrice} />
      </div>
      <div className={classes.text}>
        <EuropeMapDetails bzPrice={bzPrice} />
      </div>
    </div>
  );
}

export default MapPage;
