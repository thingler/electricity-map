import { useContext } from "react";
import DateContext from "../../store/DateContext";

import css from "./DateSelector.module.css";

function DateSelector() {
  const dateCtx = useContext(DateContext);

  function getDataString(dayOffset) {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    const day = `${d.getDate()}`.padStart(2, "0");
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  }

  function setDateToday() {
    const today = getDataString(0);
    dateCtx.updateDate(today);
  }

  function setDateTomorrow() {
    const tomorrow = getDataString(1);
    dateCtx.updateDate(tomorrow);
  }

  const today = getDataString(0);
  const tomorrow = getDataString(1);

  return (
    <ul className={css.date}>
      <li
        className={
          dateCtx.date === today ? `${css.value} ${css.selected}` : css.value
        }
        onClick={setDateToday}
      >
        Today
      </li>
      <li
        className={
          dateCtx.date === tomorrow ? `${css.value} ${css.selected}` : css.value
        }
        onClick={setDateTomorrow}
      >
        Tomorrow
      </li>
    </ul>
  );
}

export default DateSelector;
