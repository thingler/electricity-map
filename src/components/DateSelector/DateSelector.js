import { useContext } from "react";
import DateContext from "../../store/DateContext";

import css from "./DateSelector.module.css";

function DateSelector() {
  const dateCtx = useContext(DateContext);

  function getDataString(dayOffset) {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
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
    <div className={css.date}>
      <div
        className={
          dateCtx.date === today ? `${css.value} ${css.selected}` : css.value
        }
        onClick={setDateToday}
      >
        Today
      </div>
      <div
        className={
          dateCtx.date === tomorrow ? `${css.value} ${css.selected}` : css.value
        }
        onClick={setDateTomorrow}
      >
        Tomorrow
      </div>
    </div>
  );
}

export default DateSelector;
