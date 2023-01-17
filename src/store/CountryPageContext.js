import { createContext, useState } from "react";

const CountryPageContext = createContext({
  isCountryPage: false,
  setCountryPage: (value) => {},
});

export function CountryPageContextProvider(props) {
  const [countryPage, setCountryPage] = useState(false);

  const context = {
    isCountryPage: countryPage,
    setCountryPage: setCountryPage,
  };

  return (
    <CountryPageContext.Provider value={context}>
      {props.children}
    </CountryPageContext.Provider>
  );
}

export default CountryPageContext;
