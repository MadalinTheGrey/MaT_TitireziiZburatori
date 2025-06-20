const { z } = require("zod");
const supplyModel = require("../models/supplyModel");
const Busboy = require("busboy");
const csv = require("csv-parser");

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

exports.importSupplies = async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  const supplies = [];
  let fileReceived = false;

  busboy.on("file", (fieldname, file, fileInfo) => {
    if (fileReceived) {
      file.resume();
      return;
    }
    fileReceived = true;
    const { filename } = fileInfo;
    if (!filename) return;
    if (filename.endsWith(".csv")) {
      file
        .pipe(csv())
        .on("data", (row) => {
          supplies.push({
            name: row.name,
            description: row.description || null,
            in_stock: parseInt(row.in_stock) || 0,
          });
        })
        .on("end", async () => {
          await processSupplies(supplies, res);
        });
    } else if (filename.endsWith(".json")) {
      let jsonContent = "";
      file.setEncoding("utf8");
      file.on("data", (chunk) => {
        jsonContent += chunk;
      });
      file.on("end", async () => {
        try {
          const data = JSON.parse(jsonContent);
          if (!Array.isArray(data)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ error: "JSON file must contain an array" })
            );
            return;
          }
          await processSupplies(data, res);
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON file" }));
        }
      });
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unsupported file type for import" }));
    }
  });
  req.pipe(busboy);
};

async function processSupplies(supplies, res) {
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
  }
}
