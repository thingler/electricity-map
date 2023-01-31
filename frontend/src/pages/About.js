import { useContext, useEffect } from "react";
import MapPageContext from "../store/MapPageContext";
import analyticsPageView from "../components/analyticsTracker";
import css from "./About.module.css";

function AboutPage() {
  const mapPageCtx = useContext(MapPageContext);
  useEffect(() => {
    analyticsPageView();
  }, []);
  useEffect(() => {
    mapPageCtx.setMapPage(false);
  });
  return (
    <section className={css.section}>
      <div className={css.about}>
        <h1>About</h1>
        <p>
          Welcome to Thingler's Electricity Country Map, an interactive and
          up-to-date map for exploring electricity prices in Europe. The map is
          built using React and hosted on AWS with serverless services, with the
          goal of keeping hosting costs as low as possible. The pricing data is
          sourced from ENTSO-E, and updated regularly to ensure you have access
          to the most accurate information.
        </p>
        <p>
          The map displays average electricity prices by country, presented in
          the CET/CEST time zone. You can also access more detailed information
          by clicking on any of the countries on the map or by browsing the
          table.
        </p>
        <p>
          The source code is available on GitHub,{" "}
          <a href="https://github.com/thingler/electricity-map">
            github.com/thingler/electricity-map
          </a>
          . <br />
          If you have any questions or feedback, please don't hesitate to
          contact trough GitHub.
        </p>
        Thank you for visiting our site.
      </div>
    </section>
  );
}

export default AboutPage;
