import BiddingZoneList from "../BiddingZoneList";
import BiddingZone from "../EuropeMap/BiddingZone";

import css from "./CountryMap.module.css";

function CountryMap(props) {
  const biddingZoneList = BiddingZoneList();
  const country = "Finland";

  const mapData = biddingZoneList.map((zone) => {
    var price = null;
    if (zone.country === country) {
      price = 245;
    }

    return (
      <BiddingZone
        key={zone.bz}
        d={zone.d}
        textX={zone.textX}
        textY={zone.textY}
      >
        {price}
      </BiddingZone>
    );
  });

  return (
    <>
      <svg
        version="1.0"
        viewBox="600 20 300 400"
        // viewBox="400 80 390 507"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className={css.map}
      >
        <g transform="translate(-50,1249) scale(0.1,-0.1)" stroke="none">
          {mapData}
        </g>
      </svg>
    </>
  );
}

export default CountryMap;
