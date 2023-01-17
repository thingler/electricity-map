import { CountryPageContextProvider } from "../../store/CountryPageContext";
import Header from "./Header";

function Layout(props) {
  return (
    <>
      <CountryPageContextProvider>
        <Header />
      </CountryPageContextProvider>
      <main>{props.children}</main>
    </>
  );
}
export default Layout;
