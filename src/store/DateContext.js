import { createContext, useState, useEffect } from "react";

const DateContext = createContext({
  date: "",
  updateDate: (date) => {},
});

export function DateContextProvider(props) {
  const [date, setDate] = useState("");

  function updateDate(date) {
    const d = new Date(date);
    const day = `${d.getDate()}`.padStart(2, "0");
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const selectedDate = `${d.getFullYear()}-${month}-${day}`;
    setDate(selectedDate);
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
