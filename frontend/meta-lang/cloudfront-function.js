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

  // Root or /map -> /index.html
  if (uri === "/" || uri === "/map") {
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

    // /{lang} or /{lang}/map -> /{lang}/index.html
    if (rest === "" || rest === "/map") {
      request.uri = "/" + lang + "/index.html";
      return request;
    }

    // /{lang}/about -> /{lang}/about/index.html
    if (rest === "/about") {
      request.uri = "/" + lang + "/about/index.html";
      return request;
    }

    // /{lang}/country/{name} -> /{lang}/country/{name}/index.html
    if (rest.startsWith("/country/")) {
      request.uri = uri + "/index.html";
      return request;
    }
  } else {
    // /about -> /about/index.html
    if (uri === "/about") {
      request.uri = "/about/index.html";
      return request;
    }

    // /country/{name} -> /country/{name}/index.html
    if (uri.startsWith("/country/")) {
      request.uri = uri + "/index.html";
      return request;
    }
  }

  // Default: serve root index.html (for SPA fallback)
  request.uri = "/index.html";
  return request;
}
