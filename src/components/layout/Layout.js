import Header from "./Header";

function Layout(props) {
  return (
    <div>
      <Header />
      <main>{props.children}</main>
    </div>
  );
}
export default Layout;
