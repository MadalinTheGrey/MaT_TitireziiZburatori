const http = require("http");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const db = require("./db");
const matchRoute = require("./utils/matchRoute");
const { routes } = require("./routes/apiRoutes");
const { file } = require("zod/v4");

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
      let matched = null;

      for (const route of routes) {
        const result = matchRoute(route, req.method, req.url);
        if (result !== null) {
          matched = { route, ...result };
          break;
        }
      }

      if (!matched) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
        return;
      }

      req.params = matched.params;
      req.query = matched.query;

      const middlewares = matched.route.middleware || [];
      let i = 0;

      const next = async () => {
        if (i < middlewares.length) {
          const mw = middlewares[i++];
          await mw(req, res, next);
        } else {
          const contentType = req.headers["content-type"] || "";
          if (
            ["POST", "PUT", "PATCH"].includes(req.method) &&
            contentType.includes("application/json")
          ) {
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", async () => {
              try {
                req.body = body ? JSON.parse(body) : null;
              } catch (err) {
                res.writeHead(400);
                res.end("Invalid JSON");
                return;
              }
              await matched.route.handler(req, res);
            });
          } else {
            matched.route.handler(req, res);
          }
        }
      };

      next();
    } else {
      filePath = "";
      if (req.url.startsWith("/uploads")) {
        const safePathUpload = path.normalize(path.join(__dirname, req.url));
        if (!safePathUpload.startsWith(path.join(__dirname, "uploads"))) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }
        filePath = req.url;
      } else {
        //ensure the path stays in the public folder
        const safePath = path.normalize(
          path.join(__dirname, "public", req.url)
        );
        if (!safePath.startsWith(path.join(__dirname, "public"))) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }
        filePath =
          req.url === "/"
            ? "/public/HomePage/homepage.html"
            : `/public${req.url}`;
      }
      const extname = path.extname(filePath);
      const contentType =
        {
          ".html": "text/html",
          ".css": "text/css",
          ".js": "application/javascript",
          ".png": "image/png",
        }[extname] || "text/plain";

      fs.readFile(
        path.join(__dirname, decodeURI(filePath)),
        (error, content) => {
          if (error) {
            res.writeHead(404);
            res.end("Not found");
          } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
          }
        }
      );
    }
  });

  console.log("Starting server...");
  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

startApp();
