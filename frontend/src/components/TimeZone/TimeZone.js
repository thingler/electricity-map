import { useContext } from "react";
import TimeZoneContext from "../../store/TimeZoneContext";
import { analyticsEventTracker } from "../analyticsTracker";

import css from "./TimeZone.module.css";

function TimeZone(props) {
  const gaEventTracker = analyticsEventTracker("Time Zone");
  const timeZoneCtx = useContext(TimeZoneContext);

  function updateTimeZone(event) {
    gaEventTracker(event.target.value);
    timeZoneCtx.updateTimeZone(event.target.value);
  }

  return (
    <form>
      <label htmlFor="timeZone" className={css.label}>
        Time zone
      </label>
      <select
        className={css.timeZone}
        value={timeZoneCtx.timeZone}
        id="timeZone"
        onChange={updateTimeZone}
      >
        <option value="wet">WET (WEST)</option>
        <option value="cet">CET (CEST)</option>
        <option value="eet">EET (EEST)</option>
      </select>
    </form>
  );
}

export default TimeZone;
