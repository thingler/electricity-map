import { useContext, useEffect } from "react";

import CountryPriceContext from "../store/CountryPriceContext";

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

  const countryPriceCtx = useContext(CountryPriceContext);
  const biddingZoneList = BiddingZoneList();
  const priceLevels = EnergyPriceLevels();

  useEffect(() => {
    const d = new Date();
    const now = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    countryPriceCtx.updateCountryPrice(country, now);
  }, [country]);

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
    // maintainAspectRatio: false,
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
      zone.bz in countryPriceCtx.countryPrice &&
      countryPriceCtx.countryPrice[zone.bz].length > 0
    ) {
      previous.push({
        bz: zone.bz,
        data: countryPriceCtx.countryPrice[zone.bz],
      });
    }
    return previous;
  }, []);

  var offset = new Date().getTimezoneOffset() / 60;
  if (offset > 0) {
    offset = -1;
  }

  const chartJsx = countryBzs.map((zone, index) => {
    const elmentsToRemove = 3 + offset;

    const bzData = zone.data.reduce((previous, data) => {
      if (data.resolution == "PT60M") {
        previous.push(data);
      }
      return previous;
    }, []);

    // const bzData = [...zone.data];

    bzData.splice(0, elmentsToRemove);
    bzData.length = 24;

    const labels = bzData.map((timeRange) => {
      const d = new Date(timeRange.time);
      d.setHours(d.getHours() + offset * -1);
      const hour = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
      const minute =
        d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
      const chartTime = `${hour}:${minute}`;
      return chartTime;
    });

    const data = bzData.map((timeRange) =>
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

  // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  // const offset = new Date().getTimezoneOffset();
  // console.log(offset / 60);

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
