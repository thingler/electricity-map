import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BiddingZoneList from "../BiddingZoneList";

const Page = (props) => {
  const { country } = useParams();
  const biddingZoneList = BiddingZoneList();
  const countryName = biddingZoneList.reduce(
    (previous, zone) => (zone.country === country ? zone.country : previous),
    null
  );

  useEffect(() => {
    if (countryName) {
      document.title =
        props.title + countryName || "European Electricity Prices";
    } else {
      document.title = props.title || "European Electricity Prices";
    }
  }, [props.title, countryName]);
  return props.children;
};

export default Page;
