import { useState, useContext } from "react";
import MapPageContext from "../../store/MapPageContext";
import { analyticsEventTracker } from "../analyticsTracker";

import Nav from "./Nav";

import css from "./Header.module.css";

function Header() {
  const gaEventTracker = analyticsEventTracker("Menu");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const mapPageCtx = useContext(MapPageContext);

  function toggleMenu() {
    gaEventTracker("header hamburger");
    setMenuIsOpen(!menuIsOpen);
  }

  function closeMenu() {
    setMenuIsOpen(false);
  }

  const header = mapPageCtx.isMapPage
    ? `${css.header} ${css.headerMapPage}`
    : css.header;

  return (
    <header className={menuIsOpen ? `${header} ${css.menuIsOpen}` : header}>
      <div className={css.flexContainer}>
        <div className={css.logo}>Thingler</div>
        {!menuIsOpen && <Nav layout="Header" closeMenu={closeMenu} />}
        <div className={css.menuIcon} onClick={toggleMenu}>
          <span className={css.navIcon}></span>
        </div>
      </div>
      {menuIsOpen && <Nav layout="Header" closeMenu={closeMenu} />}
    </header>
  );
}

export default Header;
