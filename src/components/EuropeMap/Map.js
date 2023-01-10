import BiddingZones from "../BiddingZones";

import BiddingZone from "./BiddingZone";
import classes from "./Map.module.css";

function EuropeMap(props) {
  const biddingZones = BiddingZones();

  const mapData = biddingZones.map((zone) => {
    var averagePrice = null;
    if (zone.bz in props.bzPrice && props.bzPrice[zone.bz].length > 0) {
      var finalPrice = props.bzPrice[zone.bz].reduce(
        (previous, bz) =>
          bz.resolution === "PT60M"
            ? {
                sum: previous.sum + bz.price,
                elements: previous.elements + 1,
              }
            : previous,
        { sum: 0, elements: 0 }
      );
      averagePrice = finalPrice.sum / finalPrice.elements;
    }

    return (
      <BiddingZone
        key={zone.bz}
        d={zone.d}
        textX={zone.textX}
        textY={zone.textY}
      >
        {averagePrice}
      </BiddingZone>
    );
  });

  return (
    <svg
      version="1.0"
      viewBox="0 0 1190.0 1245.0"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={classes.map}
    >
      <g
        transform="translate(-50,1249) scale(0.1,-0.1)"
        fill="#000000"
        stroke="none"
      >
        {mapData}
      </g>
    </svg>
  );
}

export default EuropeMap;
