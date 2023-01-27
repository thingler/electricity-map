import { Link } from "react-router-dom";

function Nav(props) {
  return (
    <nav>
      <ul>
        <li>
          <Link onClick={props.closeMenu} to="/">
            Thingler
          </Link>
        </li>
        <li>
          <Link onClick={props.closeMenu} to="/map">
            Europe Map
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
