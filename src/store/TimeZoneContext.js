import { createContext, useState, useEffect } from "react";

const TimeZoneContext = createContext({
  timeZone: "",
  updateTimeZone: (offset) => {},
  getOffset: (offset) => {},
});

export function TimeZoneContextProvider(props) {
  const [timeZone, setTimeZone] = useState("");

  function updateTimeZone(timeZone) {
    setTimeZone(timeZone);
  }

  function getOffset() {
    switch (timeZone) {
      case "eet":
        return -2;
      case "cet":
        return -1;
      case "wet":
        return 0;
      default:
        return -1;
    }
  }

  useEffect(() => {
    const offset = new Date().getTimezoneOffset() / 60;
    switch (offset) {
      case -2:
        setTimeZone("eet");
        break;
      case -1:
        setTimeZone("cet");
        break;
      case 0:
        setTimeZone("wet");
        break;
      default:
        setTimeZone("cet");
    }
  }, []);

  const context = {
    timeZone: timeZone,
    updateTimeZone: updateTimeZone,
    getOffset: getOffset,
  };

  return (
    <TimeZoneContext.Provider value={context}>
      {props.children}
    </TimeZoneContext.Provider>
  );
}

export default TimeZoneContext;
