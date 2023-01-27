import { Route, Routes } from "react-router-dom";
import RootPage from "./pages/Root";
import MapPage from "./pages/Map";
import CountryPage from "./pages/Country";
import AboutPage from "./pages/About";
import Layout from "./components/layout/Layout";

import ReactGA from "react-ga4";
const TRACKING_ID = "G-XW9YHLXB38";
ReactGA.initialize(TRACKING_ID);

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/country/:country" element={<CountryPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  );
}

export default App;