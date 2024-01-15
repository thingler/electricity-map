import { useContext } from "react";
import VATContext from "../../store/VATContext";
import { countryList } from "../../components/countryList";
import { analyticsEventTracker } from "../analyticsTracker";

import css from "./VatToggle.module.css";

function VatToggle(props) {
  const gaEventTracker = analyticsEventTracker("Vat Toggle");
  const vatCtx = useContext(VATContext);

  function toggle(event) {
    gaEventTracker(event.target.value);
    vatCtx.toggle();
  }

  return (
    <form>
      <label className={css.label} htmlFor="vatToggle">
        {props.country ? `VAT ${countryList[props.country].vat}%` : "Local VAT"}
      </label>
      <div htmlFor="vatToggle" onClick={toggle} className={css.switch}>
        <input
          type="checkbox"
          onChange={toggle}
          id="vatToggle"
          checked={vatCtx.vat}
        />
        <span className={css.slider}></span>
      </div>
    </form>
  );
}

export default VatToggle;
