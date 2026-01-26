import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import MapPageContext from "../store/MapPageContext";
import { useLanguage } from "../store/LanguageContext";
import analyticsPageView from "../components/analyticsTracker";

function RootPage() {
  const mapPageCtx = useContext(MapPageContext);
  const { localizedPath } = useLanguage();

  useEffect(() => {
    analyticsPageView();
  }, []);
  useEffect(() => {
    mapPageCtx.setMapPage(false);
  });
  return <Navigate replace to={localizedPath("/map")} />;
}

export default RootPage;
