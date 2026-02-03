import { useContext } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../store/LanguageContext";
import DateContext from "../store/DateContext";

function LocalizedLink({ to, children, includeDate = true, ...props }) {
  const { localizedPath } = useLanguage();
  const dateCtx = useContext(DateContext);

  let path = to;

  // Add date to map and country paths (only if not today)
  if (includeDate && dateCtx.date) {
    const today = dateCtx.now().date;
    if (dateCtx.date !== today) {
      if (path === "/map" || path.match(/^\/map$/)) {
        path = `/map/${dateCtx.date}`;
      } else if (path.match(/^\/country\/[^/]+$/)) {
        path = `${path}/${dateCtx.date}`;
      }
    }
  }

  return (
    <Link to={localizedPath(path)} {...props}>
      {children}
    </Link>
  );
}

export default LocalizedLink;
