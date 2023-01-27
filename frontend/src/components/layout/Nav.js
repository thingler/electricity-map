import { Link } from "react-router-dom";
import { analyticsEventTracker } from "../analyticsTracker";

function Nav(props) {
  const gaEventTracker = analyticsEventTracker("Menu");

  function mapClicked() {
    gaEventTracker(`${props.layout}  map`);
    if (props.closeMenu) {
      props.closeMenu();
    }
  }
  function thinglerClicked() {
    gaEventTracker(`${props.layout} thingler`);
    if (props.closeMenu) {
      props.closeMenu();
    }
  }
  return (
    <nav>
      <ul>
        <li>
          <Link onClick={thinglerClicked} to="/">
            Thingler
          </Link>
        </li>
        <li>
          <Link onClick={mapClicked} to="/map">
            Europe Map
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
