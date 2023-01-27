import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import MapPageContext from "../store/MapPageContext";

function RootPage() {
  const mapPageCtx = useContext(MapPageContext);
  useEffect(() => {
    mapPageCtx.setMapPage(false);
  });
  return <Navigate replace to="/map" />;
  // return <div>Root page</div>;
}

export default RootPage;
