import { Link } from "react-router-dom";

function Nav(props) {
  return (
    <nav>
      <ul>
        <li>
          <Link onClick={props.toggleMenu} to="/">
            Thingler
          </Link>
        </li>
        <li>
          <Link onClick={props.toggleMenu} to="/map">
            Europe Map
          </Link>
        </li>
        <li>
          <Link onClick={props.toggleMenu} to="/country">
            Country
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
