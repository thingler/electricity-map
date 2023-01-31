import { Link } from "react-router-dom";
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

  function logoClicked() {
    gaEventTracker(`header logo`);
  }

  const header = mapPageCtx.isMapPage
    ? `${css.header} ${css.headerMapPage}`
    : css.header;

  return (
    <header className={menuIsOpen ? `${header} ${css.menuIsOpen}` : header}>
      <div className={css.flexContainer}>
        <div className={css.logo}>
          <Link
            aria-label="Logo, link to first page"
            onClick={logoClicked}
            to={`/map`}
          >
            Thingler
          </Link>
        </div>
        {!menuIsOpen && <Nav layout="Header" closeMenu={closeMenu} />}
        <button
          className={css.menuIcon}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={css.navIcon}></span>
        </button>
      </div>
      {menuIsOpen && <Nav layout="Header" closeMenu={closeMenu} />}
    </header>
  );
}

export default Header;
