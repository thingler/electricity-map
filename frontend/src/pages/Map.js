import { useContext, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MapPageContext from "../store/MapPageContext";
import DateContext from "../store/DateContext";
import analyticsPageView from "../components/analyticsTracker";

import EuropeMap from "../components/EuropeMap/Map";
import EuropeMapDetails from "../components/EuropeMapDetails/EuropeMapDetails";
import classes from "./Map.module.css";

function MapPage() {
  const mapPageCtx = useContext(MapPageContext);
  const dateCtx = useContext(DateContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { date: urlDate } = useParams();
  const isInitialMount = useRef(true);

  useEffect(() => {
    analyticsPageView();
  }, []);

  useEffect(() => {
    mapPageCtx.setMapPage(true);
  });

  // Sync date from URL (on load and when navigating back/forward)
  useEffect(() => {
    if (urlDate && /^\d{4}-\d{2}-\d{2}$/.test(urlDate)) {
      if (dateCtx.date !== urlDate) {
        dateCtx.updateDate(urlDate);
      }
    } else if (!urlDate && dateCtx.date) {
      // No date in URL means today
      const today = dateCtx.now().date;
      if (dateCtx.date !== today) {
        dateCtx.updateDate(today);
      }
    }
  }, [urlDate]);

  // Update URL when date changes via DateSelector
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (dateCtx.date) {
      const today = dateCtx.now().date;
      const basePath = location.pathname.replace(/\/map(\/\d{4}-\d{2}-\d{2})?$/, "");
      const newPath = dateCtx.date === today
        ? `${basePath}/map`
        : `${basePath}/map/${dateCtx.date}`;
      if (location.pathname !== newPath) {
        navigate(newPath);
      }
    }
  }, [dateCtx.date]);

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
