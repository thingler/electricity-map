import { BzPriceContextProvider } from "../../store/BzPriceContext";
import { MapPageContextProvider } from "../../store/MapPageContext";

import Header from "./Header";

function Layout(props) {
  return (
    <BzPriceContextProvider>
      <MapPageContextProvider>
        <Header />
        <main>{props.children}</main>
      </MapPageContextProvider>
    </BzPriceContextProvider>
  );
}
export default Layout;
