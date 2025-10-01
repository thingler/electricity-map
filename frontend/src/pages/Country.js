import { useParams } from "react-router-dom";

import { useContext, useEffect } from "react";

import DateSelector from "../components/DateSelector/DateSelector";
import TimeZone from "../components/TimeZone/TimeZone";
import VatToggle from "../components/VatToggle/VatToggle";
import MapPageContext from "../store/MapPageContext";
import CountryPriceContext from "../store/CountryPriceContext";
import DateContext from "../store/DateContext";
import TimeZoneContext from "../store/TimeZoneContext";
import analyticsPageView from "../components/analyticsTracker";
import VATContext from "../store/VATContext";
import { countryList } from "../components/countryList";

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
  const vatCtx = useContext(VATContext);

  useEffect(() => {
    analyticsPageView();
  }, []);

  useEffect(() => {
    mapPageCtx.setMapPage(false);
  });

  const countryPriceCtx = useContext(CountryPriceContext);
  const biddingZoneList = BiddingZoneList();
  const { country } = useParams();
  const countryName = biddingZoneList.reduce(
    (previous, zone) => (zone.country === country ? zone.country : previous),
    null
  );

  const vat = vatCtx.vat ? countryList[countryName].vat / 100 + 1 : 1;
  const priceLevels = EnergyPriceLevels(vat);

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
  const now = dateCtx.now();
  let enoughNewDataExist = false;

  const countryBzs = biddingZoneList.reduce((previous, zone) => {
    const bzPriceData = countryPriceCtx.getBiddingZonePrice(
      zone.bz,
      dateCtx.date
    );

    if (bzPriceData && bzPriceData.length > 12) {
      enoughNewDataExist = true;
    }

    if (zone.country === countryName && bzPriceData) {
      let bzData60M = bzPriceData.reduce((previous, data) => {
        if (data.resolution === "PT60M") {
          previous.push(data);
        }
        return previous;
      }, []);

      let bzData15M = bzPriceData.reduce((previous, data) => {
        if (data.resolution === "PT15M") {
          previous.push(data);
        }
        return previous;
      }, []);

      bzData60M.splice(0, 3 + offset);
      bzData15M.splice(0, 3 * 4 + offset * 4);

      if (bzData60M.length > 24) {
        bzData60M.length = 24;
      }

      if (bzData15M.length > 96) {
        bzData15M.length = 96;
      }

      const bzData =
        bzData15M.length >= bzData60M.length ? bzData15M : bzData60M;

      // Find the current price by matching the time property
      // Use appropriate time format based on data resolution
      const timeToMatch =
        bzData15M.length >= bzData60M.length
          ? now.currentTime15MUTC
          : now.currentTime60MUTC;
      const currentPriceItem = bzData.find((item) => item.time === timeToMatch);
      const currentPrice = currentPriceItem ? currentPriceItem.price : null;

      previous.push({
        bz: zone.bz,
        description: zone.description,
        data: bzData,
        currentPrice: currentPrice,
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
      const hour = `${d.getHours()}`.padStart(2, "0");
      const minute = `${d.getMinutes()}`.padStart(2, "0");
      const chartTime = `${hour}:${minute}`;
      return chartTime;
    });

    const data = zone.data.map((timeRange) =>
      (Math.round(timeRange.price * 10 * vat) / 100).toFixed(2)
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
        tooltip: {
          displayColors: false,
        },
        legend: {
          display: false,
          position: "top",
        },
        title: {
          display: true,
          text: zone.description ? `${zone.description} (c / kWh)` : "c / kWh",
          font: {
            size: "16",
            family: "latoRegular, sans-serif",
          },
        },
      },
    };

    return <ChartBar key={index} options={options} data={chartData} />;
  });

  function CountryInfo(props) {
    return (
      <div className={props.biddingZones > 1 ? css.manyBzs : css.oneBz}>
        <b>{props.name}</b> {props.biddingZones > 1 ? "at" : "is"}{" "}
        <b>{((props.currentPrice * 10 * vat) / 100).toFixed(2)} cents</b> per
        kilowatt-hour (<b>kWh</b>).
      </div>
    );
  }

  const infoJsx = countryBzs.map((zone, index) => {
    const name = zone.description ? zone.description : countryName;
    return (
      <CountryInfo
        key={index}
        name={name}
        biddingZones={countryBzs.length}
        currentPrice={zone.currentPrice}
      />
    );
  });

  return (
    <div className={css.flexContainer}>
      <div className={css.map}>
        <CountryMap country={countryName} zones={countryBzs} vat={vat} />
      </div>
      <div className={css.details}>
        <h1>{countryName ? countryName : "Country not found!"}</h1>
        {countryName && (
          <>
            <div className={css.description}>
              The chart{chartJsx.length > 1 && "s"} below displays the hourly
              electricity prices for {countryName}.
              {now.date === dateCtx.date && infoJsx.length === 1 && (
                <div className={css.info}>
                  The current price of electricity in {infoJsx}
                </div>
              )}
              {now.date === dateCtx.date && infoJsx.length > 1 && (
                <div className={css.info}>
                  <div>
                    The current prices for the bidding zones of{" "}
                    <b>{countryName}</b> are:
                  </div>
                  {infoJsx}
                </div>
              )}
              {!enoughNewDataExist && now.date < dateCtx.date && (
                <div className={css.note}>
                  Please be aware that the day-ahead prices for tomorrow are{" "}
                  <b>not yet availabless</b> for {countryName}!
                </div>
              )}
            </div>
            <div className={css.actionContainer}>
              <div className={css.timeZone}>
                <TimeZone />
              </div>
              <div className={css.vatSelector}>
                <VatToggle country={countryName} />
              </div>
              <div className={css.dateSelector}>
                <DateSelector />
              </div>
            </div>
          </>
        )}
        {chartJsx}
      </div>
    </div>
  );
}

export default CountryPage;
