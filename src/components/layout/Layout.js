import { BzPriceContextProvider } from "../../store/BzPriceContext";
import { MapPageContextProvider } from "../../store/MapPageContext";

import Header from "./Header";

function Layout(props) {
  return (
    <BzPriceContextProvider>
      <MapPageContextProvider>
        <Header />
      </MapPageContextProvider>
      <main>{props.children}</main>
    </BzPriceContextProvider>
  );
}
export default Layout;
