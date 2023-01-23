import { Route, Routes } from "react-router-dom";
import RootPage from "./pages/Root";
import MapPage from "./pages/Map";
import CountryPage from "./pages/Country";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/country/:country" element={<CountryPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
