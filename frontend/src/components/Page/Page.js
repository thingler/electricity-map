import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Page = (props) => {
  const { country } = useParams();

  useEffect(() => {
    console.log(props.title, country);
    if (country) {
      document.title = props.title + country || "European Electricity Prices";
    } else {
      document.title = props.title || "European Electricity Prices";
    }
  }, [props.title, country]);
  return props.children;
};

export default Page;
