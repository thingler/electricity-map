import { useState, useEffect, useContext } from "react";

import BzPriceContext from "../../store/BzPriceContext";
import VATContext from "../../store/VATContext";
import { countryList } from "../../components/countryList";

import BiddingZoneList from "../BiddingZoneList";

import BiddingZone from "./BiddingZone";
import classes from "./Map.module.css";
import PriceLevels from "../PriceLevels/PriceLevels";

function EuropeMap() {
  const bzPriceCtx = useContext(BzPriceContext);
  const vatCtx = useContext(VATContext);

  const biddingZoneList = BiddingZoneList();
  const [smallWidth, setSmallWidth] = useState(true);

  useEffect(() => {
    function handleWidth() {
      if (window.innerWidth < 600) {
        setSmallWidth(true);
      } else {
        setSmallWidth(false);
      }
    }
    handleWidth();
    window.addEventListener("resize", handleWidth);
  }, []);

  const mapData = biddingZoneList.map((zone) => {
    let averagePrice = null;
    const vat = vatCtx.vat ? countryList[zone.country].vat / 100 + 1 : 1;
    if (
      zone.bz in bzPriceCtx.bzPrice &&
      bzPriceCtx.bzPrice[zone.bz].length > 0
    ) {
      let resolution = "PT60M";
      if (bzPriceCtx.bzPrice[zone.bz].length > 24) {
        resolution = "PT15M";
      }
      const finalPrice = bzPriceCtx.bzPrice[zone.bz].reduce(
        (previous, bz) =>
          bz.resolution === resolution
            ? {
                sum: previous.sum + bz.price,
                elements: previous.elements + 1,
              }
            : previous,
        { sum: 0, elements: 0 }
      );
      if (finalPrice.elements > 0) {
        averagePrice = finalPrice.sum / finalPrice.elements;
      }
    }

    return (
      <BiddingZone
        key={`${zone.bz}-${zone.country}`}
        country={zone.country}
        d={zone.d}
        textX={zone.textX}
        textY={zone.textY}
        vat={vat}
        priceLevelVAT={vatCtx.vat ? 1.21 : 1}
      >
        {averagePrice}
      </BiddingZone>
    );
  });

  return (
    <>
      <div className={classes.energyPriceLevels}>
        <PriceLevels vat={vatCtx.vat ? 1.21 : 1} />
      </div>
      <svg
        version="1.0"
        viewBox={smallWidth ? "0 0 1000 1245" : "0 0 1190 1245"}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMid meet"
        className={classes.map}
      >
        <g transform="translate(-50,1249) scale(0.1,-0.1)" stroke="none">
          {mapData}
        </g>
      </svg>
    </>
  );
}

export default EuropeMap;
