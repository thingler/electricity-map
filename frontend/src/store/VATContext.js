import { createContext, useState } from "react";

const VATContext = createContext({
  vat: false,
  toggle: () => {},
});

export function VATContextProvider(props) {
  const [vat, setVAT] = useState(false);

  function toggle() {
    setVAT(!vat);
  }

  const context = {
    vat: vat,
    toggle: toggle,
  };

  return (
    <VATContext.Provider value={context}>{props.children}</VATContext.Provider>
  );
}

export default VATContext;
