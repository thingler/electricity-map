import { useContext } from "react";
import { useTranslation } from "react-i18next";
import VATContext from "../../store/VATContext";
import { countryList } from "../../components/countryList";
import { analyticsEventTracker } from "../analyticsTracker";

import css from "./VatToggle.module.css";

function VatToggle(props) {
  const { t } = useTranslation();
  const gaEventTracker = analyticsEventTracker("VAT Toggle");
  const vatCtx = useContext(VATContext);

  function toggle() {
    gaEventTracker("VAT Toggle");
    vatCtx.toggle();
  }

  return (
    <form>
      <label className={css.label} htmlFor="vatToggle">
        {props.country
          ? `${t("vatToggle.vat")} ${countryList[props.country].vat}%`
          : t("vatToggle.localVat")}
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
