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

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "c / kWh",
        data: [12, 2, 3, 4, 5, 10, 7],
        backgroundColor: ["#fbb879", "#8a5574"],
      },
    ],
  };

  return (
    <div className={css.flexContainer}>
      <div className={css.map}>
        <CountryMap />
      </div>
      <div className={css.details}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

export default CountryPage;
