function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Static assets - pass through
  if (
    uri.match(
      /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|map|txt|xml|webmanifest)$/i,
    )
  ) {
    return request;
  }

  // Strip trailing slash (except for root)
  if (uri.length > 1 && uri.endsWith("/")) {
    uri = uri.slice(0, -1);
  }

  // Root or /map or /map/{date} -> /index.html
  if (uri === "/" || uri === "/map" || /^\/map\/\d{4}-\d{2}-\d{2}$/.test(uri)) {
    request.uri = "/index.html";
    return request;
  }

  // Language codes
  var langs = [
    "fi",
    "sv",
    "sq",
    "bs",
    "bg",
    "hr",
    "cs",
    "da",
    "nl",
    "et",
    "fr",
    "de",
    "el",
    "hu",
    "is",
    "ga",
    "it",
    "lv",
    "lt",
    "lb",
    "mk",
    "mt",
    "cnr",
    "no",
    "pl",
    "pt",
    "ro",
    "rm",
    "ru",
    "sr",
    "sk",
    "sl",
    "es",
    "tr",
    "uk",
  ];
  var langPattern = new RegExp("^/(" + langs.join("|") + ")(/|$)");
  var match = uri.match(langPattern);

  if (match) {
    var lang = match[1];
    var rest = uri.substring(lang.length + 1); // Remove /{lang}

    // /{lang} or /{lang}/map or /{lang}/map/{date} -> /{lang}/index.html
    if (rest === "" || rest === "/map" || /^\/map\/\d{4}-\d{2}-\d{2}$/.test(rest)) {
      request.uri = "/" + lang + "/index.html";
      return request;
    }

    // /{lang}/about -> /{lang}/about/index.html
    if (rest === "/about") {
      request.uri = "/" + lang + "/about/index.html";
      return request;
    }

    // /{lang}/country/{name} or /{lang}/country/{name}/{date} -> /{lang}/country/{name}/index.html
    if (rest.startsWith("/country/")) {
      // Strip date suffix if present (YYYY-MM-DD)
      var countryPath = uri.replace(/\/\d{4}-\d{2}-\d{2}$/, "");
      request.uri = countryPath + "/index.html";
      return request;
    }
  } else {
    // /about -> /about/index.html
    if (uri === "/about") {
      request.uri = "/about/index.html";
      return request;
    }

    // /country/{name} or /country/{name}/{date} -> /country/{name}/index.html
    if (uri.startsWith("/country/")) {
      // Strip date suffix if present (YYYY-MM-DD)
      var countryPath = uri.replace(/\/\d{4}-\d{2}-\d{2}$/, "");
      request.uri = countryPath + "/index.html";
      return request;
    }
  }

  // Default: serve root index.html (for SPA fallback)
  request.uri = "/index.html";
  return request;
}
