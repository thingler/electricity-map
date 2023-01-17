import { useState, useContext } from "react";
import CountryPageContext from "../../store/CountryPageContext";

import Nav from "./Nav";

import css from "./Header.module.css";

function Header() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const countryPageCtx = useContext(CountryPageContext);

  function toggleMenu() {
    setMenuIsOpen(!menuIsOpen);
  }

  function closeMenu() {
    setMenuIsOpen(false);
    countryPageCtx.setCountryPage(false);
  }

  function flyingHeader() {
    setMenuIsOpen(false);
    countryPageCtx.setCountryPage(true);
  }

  const countryPageHeader = countryPageCtx.isCountryPage
    ? `${css.header} ${css.headerCountrypage}`
    : css.header;

  return (
    <header
      className={
        menuIsOpen
          ? `${countryPageHeader} ${css.menuIsOpen}`
          : countryPageHeader
      }
    >
      <div className={css.flexContainer}>
        <div className={css.logo}>Thingler</div>
        {!menuIsOpen && (
          <Nav flyingHeader={flyingHeader} closeMenu={closeMenu} />
        )}
        <div className={css.menuIcon} onClick={toggleMenu}>
          <span className={css.navIcon}></span>
        </div>
      </div>
      {menuIsOpen && <Nav flyingHeader={flyingHeader} closeMenu={closeMenu} />}
    </header>
  );
}

export default Header;
