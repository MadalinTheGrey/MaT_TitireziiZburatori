const http = require("http");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const db = require("./db");
const matchRoute = require("./utils/matchRoute");
const { routes } = require("./routes/apiRoutes");

const PORT = process.env.PORT || 8021;

async function startApp() {
  try {
    await db.setupDatabase();
  } catch (err) {
    console.error("Failed to setup DB:", err);
    process.exit(1);
  }

  const server = http.createServer((req, res) => {
    if (req.url.startsWith("/api")) {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        let matched = null;

        for (const route of routes) {
          const params = matchRoute(route, req.method, req.url);
          if (params !== null) {
            matched = { route, params };
            break;
          }
        }

        if (!matched) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Not Found" }));
          return;
        }

        let parsedBody = null;

        if (["POST", "PUT", "PATCH"].includes(req.method)) {
          try {
            parsedBody = body ? JSON.parse(body) : null;
          } catch (err) {
            res.writeHead(400);
            res.end("Invalid JSON");
            return;
          }
        }
        req.params = matched.params;
        req.body = parsedBody;

        matched.route.handler(req, res);
      });
    } else {
      const safePath = path.normalize(path.join(__dirname, "public", req.url));
      if (!safePath.startsWith(path.join(__dirname, "public"))) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      const filePath =
        req.url === "/"
          ? "/public/ContulMeuClient/ContulMeuClient.html"
          : `/public${req.url}`;
      const extname = path.extname(filePath);
      const contentType =
        {
          ".html": "text/html",
          ".css": "text/css",
          ".js": "application/javascript",
          ".png": "image/png",
        }[extname] || "text/plain";

      fs.readFile(path.join(__dirname, filePath), (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end("Not found");
        } else {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(content);
        }
      });
    }
  });

  console.log("Starting server...");
  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

startApp();
