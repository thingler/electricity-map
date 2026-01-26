import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fi, sv, enUS } from "date-fns/locale";

import { useContext, forwardRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DateContext from "../../store/DateContext";
import { analyticsEventTracker } from "../analyticsTracker";

import css from "./DateSelector.module.css";

function DateSelector() {
  const { t, i18n } = useTranslation();
  const gaEventTracker = analyticsEventTracker("Date picker");
  const dateCtx = useContext(DateContext);

  // Get months from translation
  const months = t("dateSelector.months", { returnObjects: true });

  // Create locales with translated month names
  useMemo(() => {
    const fiLocale = {
      ...fi,
      localize: {
        ...fi.localize,
        month: (n) => months[n],
      },
    };
    const svLocale = {
      ...sv,
      localize: {
        ...sv.localize,
        month: (n) => months[n],
      },
    };
    const enLocale = {
      ...enUS,
      localize: {
        ...enUS.localize,
        month: (n) => months[n],
      },
    };
    registerLocale("fi", fiLocale);
    registerLocale("sv", svLocale);
    registerLocale("en", enLocale);
  }, [months]);

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
          locale={i18n.language}
        />
      </li>
      <li className={css.value}>
        <button
          className={css.button}
          onClick={dateCtx.date !== today ? setDateToday : setDateTomorrow}
          aria-label={
            dateCtx.date !== today
              ? t("dateSelector.todayPrices")
              : t("dateSelector.tomorrowPrices")
          }
        >
          {dateCtx.date > today ? "← " : ""}
          {dateCtx.date !== today
            ? t("dateSelector.today")
            : t("dateSelector.tomorrow")}
          {dateCtx.date <= today ? " →" : ""}
        </button>
      </li>
    </ul>
  );
}

export default DateSelector;
