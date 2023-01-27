import { Link } from "react-router-dom";
import { analyticsEventTracker } from "../analyticsTracker";

function Nav(props) {
  const gaEventTracker = analyticsEventTracker("Menu");

  function mapClicked() {
    gaEventTracker(`${props.layout} map`);
    if (props.closeMenu) {
      props.closeMenu();
    }
  }
  function aboutClicked() {
    gaEventTracker(`${props.layout} about`);
    if (props.closeMenu) {
      props.closeMenu();
    }
  }
  return (
    <nav>
      <ul>
        <li>
          <Link onClick={mapClicked} to="/map">
            Europe Map
          </Link>
        </li>
        <li>
          <Link onClick={aboutClicked} to="/about">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
