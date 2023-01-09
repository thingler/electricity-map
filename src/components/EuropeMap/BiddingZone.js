// import css from "./BiddingZone.module.css";

function Header(props) {
  return (
    <g>
      <path className={props.className} d={props.d} />
      <text x={props.textX} y={props.textY}>
        {props.children}
      </text>
    </g>
  );
}

export default Header;
