import { createContext, useState } from "react";
import BiddingZoneList from "../components/BiddingZoneList";

const CountryPriceContext = createContext({
  countryPrice: {},
  updateCountryPrice: (date) => {},
});

export function CountryPriceContextProvider(props) {
  const [countryPrice, setCountryPrice] = useState({});
  const biddingZoneList = BiddingZoneList();

  function updateCountryPrice(country, date) {
    const biddingZones = biddingZoneList.reduce((previous, zone) => {
      if (zone.country === country) {
        previous.push(zone.bz);
      }
      return previous;
    }, []);

    if (biddingZones.length > 0) {
      fetch(
        `https://api.thingler.io/day-ahead?date=${date}&bz=${biddingZones.toString()}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setCountryPrice((price) => {
            return {
              ...price,
              ...data,
            };
          });
        });
    }
  }

  const context = {
    countryPrice: countryPrice,
    updateCountryPrice: updateCountryPrice,
  };

  return (
    <CountryPriceContext.Provider value={context}>
      {props.children}
    </CountryPriceContext.Provider>
  );
}

export default CountryPriceContext;
