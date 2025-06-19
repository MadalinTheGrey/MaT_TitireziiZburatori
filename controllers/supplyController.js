const { z } = require("zod");
const supplyModel = require("../models/supplyModel");
const fs = require("fs");
const path = require("path");
const Busboy = require("busboy");
const csv = require("csv-parser");
const { check } = require("zod/v4");

const supplySchema = z.object({
  name: z.string().min(1, { message: "Name must be included for supply" }),
  description: z.string().nullable().optional(),
  in_stock: z
    .number()
    .int()
    .min(0, { message: "in_stock must be a natural number" }),
});

exports.addSupply = async (req, res) => {
  const schemaResult = supplySchema.safeParse(req.body);
  if (!schemaResult.success) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Missing or malformed supply data",
        details: schemaResult.error.errors,
      })
    );
    return;
  }
  const supply = schemaResult.data;

  try {
    const supplyId = await supplyModel.addSupply(supply);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id: supplyId }));
  } catch (error) {
    console.error("Error adding supply: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};

const supplyStockSchema = z.object({
  in_stock: z
    .number()
    .int()
    .min(0, { message: "in_stock must be a natural number" }),
});

exports.updateSupplyStock = async (req, res) => {
  const supplyId = parseInt(req.params.id);

  if (isNaN(supplyId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid supply id" }));
    return;
  }

  const schemaResult = supplyStockSchema.safeParse(req.body);

  if (!schemaResult.success) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing or invalid stock data" }));
    return;
  }

  const { in_stock } = schemaResult.data;

  try {
    const updated = await supplyModel.updateSupplyStock(in_stock, supplyId);
    if (updated) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Supply stock updated" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Supply not found" }));
    }
  } catch (error) {
    console.error("Error updating supply: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};

exports.getSupplies = async (req, res) => {
  try {
    const supplies = await supplyModel.getSupplies(req.query);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ supplies }));
  } catch (error) {
    console.error("Error getting supplies: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};

exports.importSuppliesFromCsv = async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  const supplies = [];

  busboy.on("file", (fieldname, file, fileInfo) => {
    const { filename } = fileInfo;
    if (!filename) return;
    const dir = path.join(__dirname, "..", "uploads");
    fs.mkdirSync(dir, { recursive: true });
    const tempPath = path.join(dir, Date.now() + "-" + filename);
    const writeStream = fs.createWriteStream(tempPath);
    file.pipe(writeStream);

    writeStream.on("finish", () => {
      fs.createReadStream(tempPath)
        .pipe(csv())
        .on("data", (row) => {
          supplies.push({
            name: row.name,
            description: row.description || null,
            in_stock: parseInt(row.in_stock) || 0,
          });
        })
        .on("end", async () => {
          try {
            const checkedSupplies = [];
            for (const supply of supplies) {
              const schemaResult = supplySchema.safeParse(supply);
              if (!schemaResult.success) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    error: "Missing or invalid data for supply",
                    details: schemaResult.error.errors,
                  })
                );
                return;
              }
              checkedSupplies.push(schemaResult.data);
            }
            let insertedRows = 0;
            if (checkedSupplies.length > 0) {
              insertedRows = await supplyModel.importSupplies(checkedSupplies);
            }
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Supplies imported successfully",
                count: insertedRows,
              })
            );
          } catch (error) {
            console.error("Error importing supplies:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
          } finally {
            fs.unlink(tempPath, (err) => {
              if (err) console.error("Failed to delete temp file:", err);
            });
          }
        });
    });
  });

  req.pipe(busboy);
};
