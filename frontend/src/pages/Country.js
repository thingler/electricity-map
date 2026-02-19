import { useParams, useNavigate, useLocation } from "react-router-dom";

import { useContext, useEffect, useRef } from "react";
import { useTranslation, Trans } from "react-i18next";

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
import CostOfActivities from "../components/CostOfActivities/CostOfActivities";

import css from "./Country.module.css";

function CountryPage() {
  const { t } = useTranslation();
  const mapPageCtx = useContext(MapPageContext);
  const dateCtx = useContext(DateContext);
  const timeZoneCtx = useContext(TimeZoneContext);
  const vatCtx = useContext(VATContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    analyticsPageView();
  }, []);

  useEffect(() => {
    mapPageCtx.setMapPage(false);
  });

  const countryPriceCtx = useContext(CountryPriceContext);
  const biddingZoneList = BiddingZoneList();
  const { country, date: urlDate } = useParams();

  // Sync date from URL (on load and when navigating back/forward)
  useEffect(() => {
    if (urlDate && /^\d{4}-\d{2}-\d{2}$/.test(urlDate)) {
      if (dateCtx.date !== urlDate) {
        dateCtx.updateDate(urlDate);
      }
    } else if (!urlDate) {
      // No date in URL means today
      const today = dateCtx.now().date;
      if (dateCtx.date !== today) {
        dateCtx.updateDate(today);
      }
    }
  }, [urlDate]);

  // Update URL when date changes via DateSelector
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (dateCtx.date && country) {
      const today = dateCtx.now().date;
      const basePath = location.pathname.split("/country/")[0];
      const newPath = dateCtx.date === today
        ? `${basePath}/country/${country}`
        : `${basePath}/country/${country}/${dateCtx.date}`;
      if (location.pathname !== newPath) {
        navigate(newPath);
      }
    }
  }, [dateCtx.date]);

  // Find the country in BiddingZoneList
  const countryName = biddingZoneList.reduce(
    (prev, zone) => (zone.country === country ? zone.country : prev),
    null
  );
  const matchCountries = countryName ? [countryName] : [];

  // Translated country name for display
  const translatedCountryName = countryName
    ? t(`countries.${countryName}`, countryName)
    : null;

  const vat = vatCtx.vat ? countryList[countryName].vat / 100 + 1 : 1;
  const priceLevels = EnergyPriceLevels(vat);

  const matchKey = matchCountries.join(",");
  useEffect(() => {
    if (dateCtx.date) {
      for (const c of matchCountries) {
        countryPriceCtx.updateCountryPrice(c, dateCtx.date);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchKey, dateCtx.date]);

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

    if (matchCountries.includes(zone.country) && bzPriceData) {
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

  function formatTime(utcTime, offset) {
    const time = utcTime.replace(" ", "T");
    const d = new Date(time);
    d.setHours(d.getHours() + offset * -1);
    const hour = `${d.getHours()}`.padStart(2, "0");
    const minute = `${d.getMinutes()}`.padStart(2, "0");
    return `${hour}:${minute}`;
  }

  function toDisplayPrice(priceMWh) {
    return (Math.round(priceMWh * 10 * vat) / 100).toFixed(2);
  }

  function ZoneSummary({ zone, showTitle }) {
    if (!zone.data || zone.data.length === 0) return null;

    let sum = 0;
    let min = { price: Infinity, time: "" };
    let max = { price: -Infinity, time: "" };

    for (const item of zone.data) {
      sum += item.price;
      if (item.price < min.price) {
        min = { price: item.price, time: item.time };
      }
      if (item.price > max.price) {
        max = { price: item.price, time: item.time };
      }
    }

    const avg = sum / zone.data.length;
    const sorted = [...zone.data].sort((a, b) => a.price - b.price);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0
      ? sorted[mid].price
      : (sorted[mid - 1].price + sorted[mid].price) / 2;

    return (
      <div className={css.summarySection}>
        {showTitle && (
          <div className={css.summaryTitle}>{t("countryPage.summaryTitle")}</div>
        )}
        <div className={css.summaryGrid}>
          <div className={css.summaryItem}>
            <div className={css.summaryLabel}>{t("countryPage.averagePrice")}</div>
            <div className={css.summaryValue}>{toDisplayPrice(avg)} c/kWh</div>
          </div>
          <div className={css.summaryItem}>
            <div className={css.summaryLabel}>{t("countryPage.medianPrice")}</div>
            <div className={css.summaryValue}>{toDisplayPrice(median)} c/kWh</div>
          </div>
          <div className={css.summaryItem}>
            <div className={css.summaryLabel}>{t("countryPage.cheapestHour")}</div>
            <div className={css.summaryValue}>{toDisplayPrice(min.price)} c/kWh</div>
            <div className={css.summaryTime}>{formatTime(min.time, offset)}</div>
          </div>
          <div className={css.summaryItem}>
            <div className={css.summaryLabel}>{t("countryPage.mostExpensiveHour")}</div>
            <div className={css.summaryValue}>{toDisplayPrice(max.price)} c/kWh</div>
            <div className={css.summaryTime}>{formatTime(max.time, offset)}</div>
          </div>
        </div>
      </div>
    );
  }

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
          text: "c / kWh",
          font: {
            size: "16",
            family: "latoRegular, sans-serif",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 90,
            callback: function (value, index) {
              const label = labels[index];
              // Only show full hours (ending with :00)
              return label && label.endsWith(":00") ? label : null;
            },
          },
        },
      },
    };

    const chart = <ChartBar key={`chart-${index}`} options={options} data={chartData} />;

    if (countryBzs.length > 1) {
      return (
        <div key={index}>
          <h2 className={css.zoneName}>{zone.description}</h2>
          <ZoneSummary zone={zone} showTitle={false} />
          {chart}
        </div>
      );
    }

    return chart;
  });

  // Compute country-level avg/min/max prices (EUR/MWh) for CostOfActivities
  let countryAvg = null;
  let countryMin = null;
  let countryMax = null;
  if (countryBzs.length > 0) {
    let avgSum = 0;
    let avgCount = 0;
    let globalMin = Infinity;
    let globalMax = -Infinity;
    for (const zone of countryBzs) {
      if (!zone.data || zone.data.length === 0) continue;
      let zoneSum = 0;
      for (const item of zone.data) {
        zoneSum += item.price;
        if (item.price < globalMin) globalMin = item.price;
        if (item.price > globalMax) globalMax = item.price;
      }
      avgSum += zoneSum / zone.data.length;
      avgCount++;
    }
    if (avgCount > 0) {
      countryAvg = avgSum / avgCount;
      countryMin = globalMin;
      countryMax = globalMax;
    }
  }

  function CountryInfo(props) {
    const conjunction = props.biddingZones > 1
      ? t("countryPage.priceInfoAt")
      : t("countryPage.priceInfoIs");
    const price = ((props.currentPrice * 10 * vat) / 100).toFixed(2);

    return (
      <div className={props.biddingZones > 1 ? css.manyBzs : css.oneBz}>
        <Trans
          i18nKey="countryPage.priceInfo"
          values={{ name: props.name, conjunction, price }}
          components={{ b: <b /> }}
        />
      </div>
    );
  }

  const infoJsx = countryBzs.map((zone, index) => {
    const name = zone.description ? zone.description : translatedCountryName;
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
        <CountryMap country={countryName} matchCountries={matchCountries} zones={countryBzs} vat={vat} />
      </div>
      <div className={css.details}>
        <h1>{countryName ? translatedCountryName : t("countryPage.countryNotFound")}</h1>
        {countryName && (
          <>
            <div className={css.description}>
              {chartJsx.length > 1
                ? t("countryPage.chartDescriptionPlural", { country: translatedCountryName })
                : t("countryPage.chartDescription", { country: translatedCountryName })}
              {now.date === dateCtx.date && infoJsx.length === 1 && (
                <div className={css.info}>
                  {t("countryPage.currentPriceSingle")} {infoJsx}
                </div>
              )}
              {now.date === dateCtx.date && infoJsx.length > 1 && (
                <div className={css.info}>
                  <div>
                    <Trans
                      i18nKey="countryPage.currentPriceMultiple"
                      values={{ country: translatedCountryName }}
                      components={{ b: <b /> }}
                    />
                  </div>
                  {infoJsx}
                </div>
              )}
              {!enoughNewDataExist && now.date < dateCtx.date && (
                <div className={css.note}>
                  <Trans
                    i18nKey="countryPage.noPricesNote"
                    values={{ country: translatedCountryName }}
                    components={{ b: <b /> }}
                  />
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
            {countryBzs.length === 1 && (
              <ZoneSummary zone={countryBzs[0]} showTitle={true} />
            )}
          </>
        )}
        {chartJsx}
        <CostOfActivities avg={countryAvg} min={countryMin} max={countryMax} vat={vat} />
      </div>
    </div>
  );
}

export default CountryPage;
