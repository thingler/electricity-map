import { createContext, useState } from "react";

const MapPageContext = createContext({
  isMapPage: false,
  setMapPage: (value) => {},
});

export function MapPageContextProvider(props) {
  const [mapPage, setMapPage] = useState(false);

  const context = {
    isMapPage: mapPage,
    setMapPage: setMapPage,
  };

  return (
    <MapPageContext.Provider value={context}>
      {props.children}
    </MapPageContext.Provider>
  );
}

export default MapPageContext;
