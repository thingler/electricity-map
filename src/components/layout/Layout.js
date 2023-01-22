import { DateContextProvider } from "../../store/DateContext";
import { BzPriceContextProvider } from "../../store/BzPriceContext";
import { MapPageContextProvider } from "../../store/MapPageContext";

import Header from "./Header";

function Layout(props) {
  return (
    <DateContextProvider>
      <BzPriceContextProvider>
        <MapPageContextProvider>
          <Header />
          <main>{props.children}</main>
        </MapPageContextProvider>
      </BzPriceContextProvider>
    </DateContextProvider>
  );
}
export default Layout;
