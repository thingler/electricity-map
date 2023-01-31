import { createContext, useContext, useState, useEffect } from "react";
import DateContext from "../store/DateContext";

const BzPriceContext = createContext({
  bzPrice: {},
  updateBzPrice: (date) => {},
});

export function BzPriceContextProvider(props) {
  const [bzPrice, setBzPrice] = useState({});

  const dateCtx = useContext(DateContext);

  function updateBzPrice(date) {
    fetch(`${process.env.REACT_APP_API}/day-ahead?date=${date}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBzPrice(data);
      });
  }

  useEffect(() => {
    if (dateCtx.date) {
      updateBzPrice(dateCtx.date);
    }
  }, [dateCtx.date]);

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
