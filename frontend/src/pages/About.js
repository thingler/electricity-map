import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MapPageContext from "../store/MapPageContext";
import analyticsPageView from "../components/analyticsTracker";
import css from "./About.module.css";

function AboutPage() {
  const { t } = useTranslation();
  const mapPageCtx = useContext(MapPageContext);

  useEffect(() => {
    analyticsPageView();
  }, []);
  useEffect(() => {
    mapPageCtx.setMapPage(false);
  });

  return (
    <section className={css.section}>
      <div className={css.about}>
        <h1>{t("about.title")}</h1>
        <p>{t("about.paragraph1")}</p>
        <p>{t("about.paragraph2")}</p>
        <p>
          {t("about.paragraph3Start")}
          <a href="https://github.com/thingler/electricity-map">
            github.com/thingler/electricity-map
          </a>
          {t("about.paragraph3End")}
        </p>
        {t("about.thankYou")}
      </div>
    </section>
  );
}

export default AboutPage;
