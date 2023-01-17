import { MapPageContextProvider } from "../../store/MapPageContext";
import Header from "./Header";

function Layout(props) {
  return (
    <>
      <MapPageContextProvider>
        <Header />
      </MapPageContextProvider>
      <main>{props.children}</main>
    </>
  );
}
export default Layout;
