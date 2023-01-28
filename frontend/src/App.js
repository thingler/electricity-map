import { Route, Routes } from "react-router-dom";
import Page from "./components/Page/Page";
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
        <Route
          path="/"
          element={
            <Page title="Thingler">
              <RootPage />
            </Page>
          }
        />
        <Route
          path="/map"
          element={
            <Page title="European Electricity Prices">
              <MapPage />
            </Page>
          }
        />
        <Route
          path="/country/:country"
          element={
            <Page title="Electricity Prices for ">
              <CountryPage />
            </Page>
          }
        />
        <Route
          path="/about"
          element={
            <Page title="About Thingler Electricity Prices">
              <AboutPage />
            </Page>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
