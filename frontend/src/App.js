import { Route, Routes, Navigate } from "react-router-dom";
import Page from "./components/Page/Page";
import RootPage from "./pages/Root";
import MapPage from "./pages/Map";
import CountryPage from "./pages/Country";
import AboutPage from "./pages/About";
import Layout from "./components/layout/Layout";

import ReactGA from "react-ga4";
const TRACKING_ID = "G-XW9YHLXB38";
ReactGA.initialize(TRACKING_ID);

const supportedLangs = [
  "fi", "sv", "sq", "bs", "bg", "hr", "cs", "da", "nl",
  "et", "fr", "de", "el", "hu", "is", "ga", "it", "lv", "lt",
  "lb", "mk", "mt", "cnr", "no", "pl", "pt", "ro", "rm", "ru",
  "sr", "sk", "sl", "es", "tr", "uk"
];

function AppRoutes() {
  return (
    <Routes>
      {/* English routes (default, no prefix) */}
      <Route
        path="/"
        element={
          <Page titleKey="pageTitle.thingler">
            <RootPage />
          </Page>
        }
      />
      <Route
        path="/map"
        element={
          <Page titleKey="pageTitle.europeanElectricityPrices">
            <MapPage />
          </Page>
        }
      />
      <Route
        path="/map/:date"
        element={
          <Page titleKey="pageTitle.europeanElectricityPrices">
            <MapPage />
          </Page>
        }
      />
      <Route path="/country" element={<Navigate to="/map" replace />} />
      <Route
        path="/country/:country"
        element={
          <Page titleKey="pageTitle.electricityPricesFor">
            <CountryPage />
          </Page>
        }
      />
      <Route
        path="/country/:country/:date"
        element={
          <Page titleKey="pageTitle.electricityPricesFor">
            <CountryPage />
          </Page>
        }
      />
      <Route
        path="/about"
        element={
          <Page titleKey="pageTitle.aboutThingler">
            <AboutPage />
          </Page>
        }
      />
      {/* Language-prefixed routes */}
      {supportedLangs.map((lang) => (
        <Route key={lang} path={`/${lang}/*`} element={<LanguageRoutes />} />
      ))}
    </Routes>
  );
}

function LanguageRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Page titleKey="pageTitle.thingler">
            <RootPage />
          </Page>
        }
      />
      <Route
        path="/map"
        element={
          <Page titleKey="pageTitle.europeanElectricityPrices">
            <MapPage />
          </Page>
        }
      />
      <Route
        path="/map/:date"
        element={
          <Page titleKey="pageTitle.europeanElectricityPrices">
            <MapPage />
          </Page>
        }
      />
      <Route path="/country" element={<Navigate to="../map" replace />} />
      <Route
        path="/country/:country"
        element={
          <Page titleKey="pageTitle.electricityPricesFor">
            <CountryPage />
          </Page>
        }
      />
      <Route
        path="/country/:country/:date"
        element={
          <Page titleKey="pageTitle.electricityPricesFor">
            <CountryPage />
          </Page>
        }
      />
      <Route
        path="/about"
        element={
          <Page titleKey="pageTitle.aboutThingler">
            <AboutPage />
          </Page>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
