import { Link } from "react-router-dom";

import classes from "./Header.module.css";

function Header() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>Thingler</div>
      <nav>
        <div className={classes.menuIcon}>
          <span className={classes.navIcon}></span>
        </div>
        <ul>
          <li>
            <Link to="/">Thingler</Link>
          </li>
          <li>
            <Link to="/map">Europe Map</Link>
          </li>
          <li>
            <Link to="/country">Country</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
