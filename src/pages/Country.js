import { useContext } from "react";

import BzPriceContext from "../store/BzPriceContext";

import BiddingZoneList from "../components/BiddingZoneList";
import EnergyPriceLevels from "../components/EnergyPriceLevels";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import CountryMap from "../components/CountryMap/CountryMap";

import css from "./Country.module.css";

function CountryPage() {
  const country = "Finland";

  const biddingZoneList = BiddingZoneList();

  const bzPriceCtx = useContext(BzPriceContext);

  const priceLevels = EnergyPriceLevels();

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: true,
        text: "c / kWh",
      },
    },
  };

  const countryBzs = biddingZoneList.reduce((previous, zone) => {
    if (
      zone.country === country &&
      zone.bz in bzPriceCtx.bzPrice &&
      bzPriceCtx.bzPrice[zone.bz].length > 0
    ) {
      previous.push({
        bz: zone.bz,
        data: bzPriceCtx.bzPrice[zone.bz],
      });
    }
    return previous;
  }, []);

  const chartJsx = countryBzs.map((zone, index) => {
    const labels = zone.data.map((timeRange) =>
      timeRange.time.substring(
        timeRange.time.indexOf(" ") + 1,
        timeRange.time.lastIndexOf(":")
      )
    );

    const data = zone.data.map((timeRange) =>
      (Math.round(timeRange.price * 10) / 100).toFixed(2)
    );

    const backgroundColor = data.map((price) => {
      const priceMWh = price * 10;
      if (priceMWh > priceLevels.high) {
        return "#8a5574";
      }
      if (priceMWh > priceLevels.concerning) {
        return "#fbb879";
      }
      if (priceMWh > priceLevels.medium) {
        return "#fbcd62";
      }
      if (priceMWh > priceLevels.low) {
        return "#75bb94";
      }
      return "#82e4b5";
    });

    const chartData = {
      labels,
      datasets: [
        {
          label: "c / kWh",
          data: data,
          backgroundColor: backgroundColor,
        },
      ],
    };

    return <Bar key={index} options={options} data={chartData} />;
  });

  return (
    <div className={css.flexContainer}>
      <div className={css.map}>
        <CountryMap />
      </div>
      <div className={css.details}>{chartJsx}</div>
    </div>
  );
}

export default CountryPage;
