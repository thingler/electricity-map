import { useState, useContext } from "react";
import MapPageContext from "../../store/MapPageContext";

import Nav from "./Nav";

import css from "./Header.module.css";

function Header() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const mapPageCtx = useContext(MapPageContext);

  function toggleMenu() {
    setMenuIsOpen(!menuIsOpen);
  }

  function closeMenu() {
    setMenuIsOpen(false);
    mapPageCtx.setMapPage(false);
  }

  function flyingHeader() {
    setMenuIsOpen(false);
    mapPageCtx.setMapPage(true);
  }

  const header = mapPageCtx.isMapPage
    ? `${css.header} ${css.headerMapPage}`
    : css.header;

  return (
    <header className={menuIsOpen ? `${header} ${css.menuIsOpen}` : header}>
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
