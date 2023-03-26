import { createContext, useState, useEffect } from "react";

const TimeZoneContext = createContext({
  timeZone: "",
  updateTimeZone: (offset) => {},
  getOffset: (offset) => {},
});

export function TimeZoneContextProvider(props) {
  const [timeZone, setTimeZone] = useState("");
  const [dst, setDst] = useState(true);

  function updateTimeZone(timeZone) {
    setTimeZone(timeZone);
  }

  function getOffset() {
    const dstCalibration = dst ? 1 : 0;
    switch (timeZone) {
      case "eet":
        return -2 - dstCalibration;
      case "cet":
        return -1 - dstCalibration;
      case "wet":
        return 0 - dstCalibration;
      default:
        return -1 - dstCalibration;
    }
  }

  function isDst(offsetInHours) {
    const d = new Date();
    const jul = new Date(d.getFullYear(), 6, 1);
    const dstOffset = jul.getTimezoneOffset() / 60;
    return dstOffset === offsetInHours;
  }

  useEffect(() => {
    const offset = new Date().getTimezoneOffset() / 60;
    setDst(isDst(offset));
    const dstCalibration = dst ? 1 : 0;

    switch (offset) {
      case -2 - dstCalibration:
        setTimeZone("eet");
        break;
      case -1 - dstCalibration:
        setTimeZone("cet");
        break;
      case 0 - dstCalibration:
        setTimeZone("wet");
        break;
      default:
        setTimeZone("cet");
    }
  }, [dst]);

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
