import Nav from "./Nav";
import css from "./Footer.module.css";

function Footer() {
  return (
    <footer className={css.footer}>
      <hr />
      <div className={css.content}>
        The pricing information displayed is sourced from ENTSO-E - the European
        Network of Transmission System Operators for Electricity. All prices are
        originally in Central European Time (CET/CEST).
        <Nav />
      </div>
    </footer>
  );
}

export default Footer;
