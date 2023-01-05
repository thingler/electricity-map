import { useState } from "react";

import Nav from "./Nav";

import css from "./Header.module.css";

function Header() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  function toggleMenu() {
    setMenuIsOpen(!menuIsOpen);
  }

  return (
    <header
      className={menuIsOpen ? `${css.header} ${css.menuIsOpen}` : css.header}
    >
      <div className={css.flexContainer}>
        <div className={css.logo}>Thingler</div>
        {!menuIsOpen && <Nav />}
        <div className={css.menuIcon} onClick={toggleMenu}>
          <span className={css.navIcon}></span>
        </div>
      </div>
      {menuIsOpen && <Nav toggleMenu={toggleMenu} />}
    </header>
  );
}

export default Header;
