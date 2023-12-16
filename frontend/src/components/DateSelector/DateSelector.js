import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useContext, forwardRef } from "react";
import DateContext from "../../store/DateContext";
import { analyticsEventTracker } from "../analyticsTracker";

import css from "./DateSelector.module.css";

function DateSelector() {
  const gaEventTracker = analyticsEventTracker("Date picker");
  const dateCtx = useContext(DateContext);

  function getDateString(dateObject, dayOffset) {
    dateObject.setDate(dateObject.getDate() + dayOffset);
    const day = `${dateObject.getDate()}`.padStart(2, "0");
    const month = `${dateObject.getMonth() + 1}`.padStart(2, "0");
    return `${dateObject.getFullYear()}-${month}-${day}`;
  }

  function setDateToday() {
    gaEventTracker("today");
    const today = getDateString(new Date(), 0);
    dateCtx.updateDate(today);
  }

  function setDateTomorrow() {
    gaEventTracker("tomorrow");
    const tomorrow = getDateString(new Date(), 1);
    dateCtx.updateDate(tomorrow);
  }

  function setDate(date) {
    gaEventTracker("custom date");
    const selectedDate = getDateString(date, 0);
    dateCtx.updateDate(selectedDate);
  }

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className={css.button}
      onClick={onClick}
      ref={ref}
      aria-label="Date Picker"
    >
      {value}
    </button>
  ));

  const today = getDateString(new Date(), 0);

  const tomorrowDateObject = new Date();
  tomorrowDateObject.setDate(tomorrowDateObject.getDate() + 1);

  return (
    <ul className={css.date}>
      <li className={css.value}>
        <DatePicker
          selected={dateCtx.getDateObject()}
          onChange={(date) => setDate(date)}
          dateFormat="dd.MM.yyyy"
          maxDate={tomorrowDateObject}
          customInput={<CustomInput />}
        />
      </li>
      <li className={css.value}>
        <button
          className={css.button}
          onClick={dateCtx.date !== today ? setDateToday : setDateTomorrow}
          aria-label={
            dateCtx.date !== today ? "Today's prices" : "Tomorrow's prices"
          }
        >
          {dateCtx.date > today ? "← " : ""}
          {dateCtx.date !== today ? "Today" : "Tomorrow"}
          {dateCtx.date <= today ? " →" : ""}
        </button>
      </li>
    </ul>
  );
}

export default DateSelector;
