import { TimeZoneContextProvider } from "../../store/TimeZoneContext";
import { DateContextProvider } from "../../store/DateContext";
import { BzPriceContextProvider } from "../../store/BzPriceContext";
import { CountryPriceContextProvider } from "../../store/CountryPriceContext";
import { MapPageContextProvider } from "../../store/MapPageContext";

import Header from "./Header";

function Layout(props) {
  return (
    <TimeZoneContextProvider>
      <DateContextProvider>
        <BzPriceContextProvider>
          <CountryPriceContextProvider>
            <MapPageContextProvider>
              <Header />
              <main>{props.children}</main>
            </MapPageContextProvider>
          </CountryPriceContextProvider>
        </BzPriceContextProvider>
      </DateContextProvider>
    </TimeZoneContextProvider>
  );
}
export default Layout;
