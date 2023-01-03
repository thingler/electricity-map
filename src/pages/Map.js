import EuropeMap from "../components/EuropeMap/Map";
import classes from "./Map.module.css";

function MapPage() {
  return (
    <div>
      <div className={classes.flexContainer}>
        <div className={classes.map}>
          <EuropeMap />
        </div>
        <div className={classes.text}>
          <h1>Map of Europe</h1>
          <section>
            <p>Some text here...</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
