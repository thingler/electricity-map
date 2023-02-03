import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BiddingZoneList from "../BiddingZoneList";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Page = (props) => {
  const { country } = useParams();
  const biddingZoneList = BiddingZoneList();
  const countryName = biddingZoneList.reduce(
    (previous, zone) => (zone.country === country ? zone.country : previous),
    null
  );
  let title = "European Electricity Prices";
  if (countryName) {
    title = props.title + countryName || "European Electricity Prices";
  } else {
    title = props.title || "European Electricity Prices";
  }

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={`Thingler - ${title}`} />
          <meta property="og:image" content="https://thingler.io/map.png" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="thingler.io" />
          <meta property="twitter:url" content={window.location.href} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={`Thingler - ${title}`} />
          <meta name="twitter:image" content="https://thingler.io/map.png" />
        </Helmet>
      </HelmetProvider>
      {props.children}
    </>
  );
};

export default Page;
