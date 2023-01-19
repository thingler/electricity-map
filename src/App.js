import { Route, Routes } from "react-router-dom";
import RootPage from "./pages/Root";
import MapPage from "./pages/Map";
import CountryPage from "./pages/Country";
import Layout from "./components/layout/Layout";
import { CountryPriceContextProvider } from "./store/CountryPriceContext";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route
          path="/country"
          element={
            <CountryPriceContextProvider>
              <CountryPage />
            </CountryPriceContextProvider>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
