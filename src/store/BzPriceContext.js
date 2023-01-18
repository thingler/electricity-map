import { createContext, useState, useEffect } from "react";

const BzPriceContext = createContext({
  bzPrice: {},
  updateBzPrice: (date) => {},
});

export function BzPriceContextProvider(props) {
  const [bzPrice, setBzPrice] = useState({});

  function updateBzPrice(date) {
    fetch(`https://api.thingler.io/day-ahead?date=${date}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBzPrice(data);
      });
  }

  useEffect(() => {
    const d = new Date();
    const now = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    updateBzPrice(now);
  }, []);

  const context = {
    bzPrice: bzPrice,
    updateBzPrice: updateBzPrice,
  };

  return (
    <BzPriceContext.Provider value={context}>
      {props.children}
    </BzPriceContext.Provider>
  );
}

export default BzPriceContext;
