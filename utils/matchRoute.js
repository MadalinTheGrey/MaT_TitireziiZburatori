function matchRoute(route, reqMethod, reqUrl) {
  if (route.method !== reqMethod) return null;

  const [pathPart, queryString = ""] = reqUrl.split("?");
  const routeParts = route.path.split("/").filter(Boolean);
  const urlParts = pathPart.split("/").filter(Boolean);

  if (routeParts.length !== urlParts.length) return null;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const urlPart = urlParts[i];

    if (routePart.startsWith(":")) {
      const paramName = routePart.slice(1);
      params[paramName] = decodeURIComponent(urlPart);
    } else if (routePart !== urlPart) {
      return null;
    }
  }

  const query = {};
  if (queryString) {
    queryString.split("&").forEach((pair) => {
      const [key, value = ""] = pair.split("=");
      query[decodeURIComponent(key)] = decodeURIComponent(value || "");
    });
  }

  return { params, query };
}

module.exports = matchRoute;
