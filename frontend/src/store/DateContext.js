import { createContext, useState, useEffect } from "react";

const DateContext = createContext({
  date: "",
  getDateObject: () => {},
  updateDate: (date) => {},
  now: () => {},
});

export function DateContextProvider(props) {
  const [date, setDate] = useState("");

  function getDateObject() {
    if (date === "") return new Date();
    const dateParts = date.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    return new Date(year, month - 1, day);
  }

  function updateDate(date) {
    const dateParts = date.split("-");
    const year = dateParts[0];
    const month = dateParts[1].padStart(2, "0");
    const day = dateParts[2].padStart(2, "0");
    const selectedDate = `${year}-${month}-${day}`;
    setDate(selectedDate);
  }

  function now() {
    const d = new Date();
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");

    return {
      date: `${year}-${month}-${day}`,
      currentHourUTC: d.getUTCHours(),
      currentTime15MUTC: `${year}-${month}-${day} ${d.getUTCHours()}:${
        d.getUTCMinutes() - (d.getUTCMinutes() % 15)
      }:00`,
      currentTime60MUTC: `${year}-${month}-${day} ${d.getUTCHours()}:00:00`,
    };
  }

  useEffect(() => {
    const d = new Date();
    const now = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    updateDate(now);
  }, []);

  const context = {
    date: date,
    getDateObject: getDateObject,
    updateDate: updateDate,
    now: now,
  };

  return (
    <DateContext.Provider value={context}>
      {props.children}
    </DateContext.Provider>
  );
}

export default DateContext;
