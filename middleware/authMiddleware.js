const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (requiredRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing Authorization header" }));
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid Authorization header format" }));
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (
        requiredRoles.length > 0 &&
        !requiredRoles.some((role) => decoded.roles.includes(role)) &&
        !decoded.roles.includes("admin")
      ) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Forbidden: insufficient role" }));
        return;
      }

      await next();
    } catch (err) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid or expired token" }));
    }
  };
};
