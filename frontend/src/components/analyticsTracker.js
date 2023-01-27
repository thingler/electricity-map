import ReactGA from "react-ga4";

export const analyticsEventTracker = (category = "Thingler") => {
  const eventTracker = (action = "Default action", label = "Default label") => {
    ReactGA.event({ category, action, label });
  };
  return eventTracker;
};

const analyticsPageView = () => {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });
};

export default analyticsPageView;
