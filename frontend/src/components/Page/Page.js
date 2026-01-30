import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BiddingZoneList from "../BiddingZoneList";

const Page = (props) => {
  const { t } = useTranslation();
  const { country } = useParams();
  const biddingZoneList = BiddingZoneList();
  const countryName = biddingZoneList.reduce(
    (previous, zone) => (zone.country === country ? zone.country : previous),
    null
  );

  let title = t("pageTitle.europeanElectricityPrices");
  if (props.titleKey) {
    const translatedTitle = t(props.titleKey);
    if (countryName) {
      const translatedCountryName = t(`countries.${countryName}`, countryName);
      title = translatedTitle + translatedCountryName;
    } else {
      title = translatedTitle;
    }
  }

  useEffect(() => {
    document.title = title;
  }, [title]);

  return props.children;
};

export default Page;
