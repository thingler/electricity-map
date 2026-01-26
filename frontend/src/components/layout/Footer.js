import { useTranslation } from "react-i18next";
import Nav from "./Nav";
import css from "./Footer.module.css";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={css.footer}>
      <hr />
      <div className={css.content}>
        {t("footer.attribution")}
        <Nav layout="Footer" />
      </div>
    </footer>
  );
}

export default Footer;
