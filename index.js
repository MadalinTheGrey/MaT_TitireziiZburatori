const db = require("./db");
const http = require("http");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

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
      // TODO: Add API routing logic here
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "API endpoint not implemented yet" }));
      return;
    }

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
  });

  console.log("Starting server...");
  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

startApp();
