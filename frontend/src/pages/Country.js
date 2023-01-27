import { useParams } from "react-router-dom";

import { useContext, useEffect } from "react";

import DateSelector from "../components/DateSelector/DateSelector";
import TimeZone from "../components/TimeZone/TimeZone";
import MapPageContext from "../store/MapPageContext";
import CountryPriceContext from "../store/CountryPriceContext";
import DateContext from "../store/DateContext";
import TimeZoneContext from "../store/TimeZoneContext";
import analyticsPageView from "../components/analyticsTracker";

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
  const mapPageCtx = useContext(MapPageContext);
  const dateCtx = useContext(DateContext);
  const timeZoneCtx = useContext(TimeZoneContext);

  useEffect(() => {
    analyticsPageView();
  }, []);

  useEffect(() => {
    mapPageCtx.setMapPage(false);
  });

  const { country } = useParams();

  const countryPriceCtx = useContext(CountryPriceContext);
  const biddingZoneList = BiddingZoneList();
  const priceLevels = EnergyPriceLevels();

  const countryName = biddingZoneList.reduce(
    (previous, zone) => (zone.country === country ? zone.country : previous),
    null
  );

  useEffect(() => {
    if (dateCtx.date) {
      countryPriceCtx.updateCountryPrice(countryName, dateCtx.date);
    }
  }, [countryName, dateCtx.date]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const offset = timeZoneCtx.getOffset();

  const countryBzs = biddingZoneList.reduce((previous, zone) => {
    const bzPriceData = countryPriceCtx.getBiddingZonePrice(
      zone.bz,
      dateCtx.date
    );
    if (zone.country === countryName && bzPriceData) {
      let bzData = bzPriceData.reduce((previous, data) => {
        if (data.resolution === "PT60M") {
          previous.push(data);
        }
        return previous;
      }, []);
      bzData.splice(0, 3 + offset);
      if (bzData.length > 24) {
        bzData.length = 24;
      }
      previous.push({
        bz: zone.bz,
        description: zone.description,
        data: bzData,
      });
    }
    return previous;
  }, []);

  function ChartBar(props) {
    return (
      <div className={css.chartBox}>
        <Bar options={props.options} data={props.data} />
      </div>
    );
  }

  const chartJsx = countryBzs.map((zone, index) => {
    const labels = zone.data.map((timeRange) => {
      const time = timeRange.time.replace(" ", "T");
      const d = new Date(time);
      d.setHours(d.getHours() + offset * -1);
      const hour = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
      const minute =
        d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
      const chartTime = `${hour}:${minute}`;
      return chartTime;
    });

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

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: "top",
        },
        title: {
          display: true,
          text: zone.description ? `${zone.description} (c / kWh)` : "c / kWh",
        },
      },
    };

    return <ChartBar key={index} options={options} data={chartData} />;
  });

  return (
    <div className={css.flexContainer}>
      <div className={css.map}>
        <CountryMap country={countryName} zones={countryBzs} />
      </div>
      <div className={css.details}>
        <h1>{countryName ? countryName : "Country not found!"}</h1>
        <div className={css.actionContainer}>
          <div className={css.timeZone}>
            <TimeZone />
          </div>
          <div className={css.dateSelector}>
            <DateSelector />
          </div>
        </div>
        {chartJsx}
      </div>
    </div>
  );
}

export default CountryPage;
