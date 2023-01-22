import { createContext, useState, useEffect } from "react";

const DateContext = createContext({
  date: "",
  updateDate: (date) => {},
});

export function DateContextProvider(props) {
  const [date, setDate] = useState("");

  function updateDate(date) {
    setDate(date);
  }

  useEffect(() => {
    const d = new Date();
    const now = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    updateDate(now);
  }, []);

  const context = {
    date: date,
    updateDate: updateDate,
  };

  return (
    <DateContext.Provider value={context}>
      {props.children}
    </DateContext.Provider>
  );
}

export default DateContext;
