import { useContext } from "react";
import TimeZoneContext from "../../store/TimeZoneContext";

import css from "./TimeZone.module.css";

function TimeZone(props) {
  const timeZoneCtx = useContext(TimeZoneContext);

  function updateTimeZone(event) {
    timeZoneCtx.updateTimeZone(event.target.value);
  }

  return (
    <form>
      <label className={css.label}>Time zone:</label>
      <select
        className={css.timeZone}
        value={timeZoneCtx.timeZone}
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
