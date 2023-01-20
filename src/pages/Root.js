import { useContext } from "react";
import MapPageContext from "../store/MapPageContext";

function RootPage() {
  const mapPageCtx = useContext(MapPageContext);
  mapPageCtx.setMapPage(false);

  return <div>Root page</div>;
}

export default RootPage;
