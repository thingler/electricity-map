import { createContext, useState } from "react";
import BiddingZoneList from "../components/BiddingZoneList";

const CountryPriceContext = createContext({
  countryPrice: {},
  getBiddingZonePrice: (country, date) => {},
  updateCountryPrice: (country, date) => {},
});

export function CountryPriceContextProvider(props) {
  const [countryPrice, setCountryPrice] = useState({});
  const biddingZoneList = BiddingZoneList();

  function getBiddingZonePrice(bz, date) {
    return bz in countryPrice &&
      date in countryPrice[bz] &&
      countryPrice[bz][date].length > 0
      ? countryPrice[bz][date]
      : null;
  }

  function updateCountryPrice(country, date) {
    const biddingZones = biddingZoneList.reduce((previous, zone) => {
      if (zone.country === country) {
        previous.push(zone.bz);
      }
      return previous;
    }, []);

    if (biddingZones.length > 0) {
      fetch(
        `${
          process.env.REACT_APP_API
        }/day-ahead?date=${date}&bz=${biddingZones.toString()}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setCountryPrice((price) => {
            let newData = false;
            let dateScopedData = {};

            for (const bz in data) {
              if (
                !(bz in price) ||
                JSON.stringify(data[bz]) !== JSON.stringify(price[bz][date])
              ) {
                dateScopedData[bz] = {};
                dateScopedData[bz][date] = data[bz];
                newData = true;
              }
            }
            return newData
              ? {
                  ...price,
                  ...dateScopedData,
                }
              : price;
          });
        });
    }
  }

  const context = {
    countryPrice: countryPrice,
    getBiddingZonePrice: getBiddingZonePrice,
    updateCountryPrice: updateCountryPrice,
  };

  return (
    <CountryPriceContext.Provider value={context}>
      {props.children}
    </CountryPriceContext.Provider>
  );
}

export default CountryPriceContext;
