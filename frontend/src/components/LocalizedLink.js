import { Link } from "react-router-dom";
import { useLanguage } from "../store/LanguageContext";

function LocalizedLink({ to, children, ...props }) {
  const { localizedPath } = useLanguage();

  return (
    <Link to={localizedPath(to)} {...props}>
      {children}
    </Link>
  );
}

export default LocalizedLink;
