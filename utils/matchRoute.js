function matchRoute(route, reqMethod, reqUrl) {
  if (route.method !== reqMethod) return null;

  const routeParts = route.path.split("/").filter(Boolean);
  //split filters from path and then get path parts
  const urlParts = reqUrl.split("?")[0].split("/").filter(Boolean);

  if (routeParts.length !== urlParts.length) return null;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const urlPart = urlParts[i];

    if (routePart.startsWith(":")) {
      const paramName = routePart.slice(1);
      params[paramName] = urlPart;
    } else if (routePart !== urlPart) {
      return null;
    }
  }

  return params;
}

module.exports = matchRoute;
