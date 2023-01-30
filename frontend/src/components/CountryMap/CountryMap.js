import BiddingZoneList from "../BiddingZoneList";
import BiddingZone from "../EuropeMap/BiddingZone";
import PriceLevels from "../PriceLevels/PriceLevels";

import css from "./CountryMap.module.css";

function CountryMap(props) {
  const biddingZoneList = BiddingZoneList();
  let viewBox = "";

  const mapData = biddingZoneList.map((zone) => {
    let price = null;

    if (zone.country === props.country) {
      viewBox = zone.viewBox;
      const averagePrice = props.zones.reduce((previous, cZone) => {
        if (zone.bz !== cZone.bz) {
          return previous;
        }
        const priceSum = cZone.data.reduce((previousPrice, data) => {
          return previousPrice + data.price;
        }, 0);
        return priceSum / cZone.data.length;
      }, []);

      if (averagePrice > 0) {
        price = averagePrice;
      }
    }

    return (
      <BiddingZone
        key={zone.bz}
        country={zone.country}
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
      <div className={css.energyPriceLevels}>
        <PriceLevels />
      </div>
      <svg
        width="100%"
        version="1.0"
        viewBox={viewBox ? viewBox : "0 0 1190 1245"}
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
