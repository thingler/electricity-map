import { TimeZoneContextProvider } from "../../store/TimeZoneContext";
import { DateContextProvider } from "../../store/DateContext";
import { BzPriceContextProvider } from "../../store/BzPriceContext";
import { VATContextProvider } from "../../store/VATContext";
import { CountryPriceContextProvider } from "../../store/CountryPriceContext";
import { MapPageContextProvider } from "../../store/MapPageContext";

import Header from "./Header";
import Footer from "./Footer";

function Layout(props) {
  return (
    <TimeZoneContextProvider>
      <DateContextProvider>
        <BzPriceContextProvider>
          <VATContextProvider>
            <CountryPriceContextProvider>
              <MapPageContextProvider>
                <Header />
                <main>{props.children}</main>
                <Footer />
              </MapPageContextProvider>
            </CountryPriceContextProvider>
          </VATContextProvider>
        </BzPriceContextProvider>
      </DateContextProvider>
    </TimeZoneContextProvider>
  );
}
export default Layout;
