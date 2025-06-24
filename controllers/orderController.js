const { z } = require("zod");
const supplyModel = require("../models/supplyModel");
const orderModel = require("../models/orderModel");

const orderSchema = z.object({
  supply_name: z.string().min(1),
  provider: z.string().min(1),
  description: z.string().nullable().optional(),
});

exports.addOrder = async (req, res) => {
  const schemaResult = orderSchema.safeParse(req.body);
  if (!schemaResult.success) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing or malformed order data" }));
    return;
  }
  const order = schemaResult.data;

  try {
    const existsSupply = await supplyModel.existsSupply(order.supply_name);
    if (!existsSupply) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Associated supply not found" }));
      return;
    }
    order.supply_id = await supplyModel.getSupplyId(order.supply_name);
    const orderId = await orderModel.addOrder(order);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id: orderId }));
  } catch (error) {
    console.error("Error adding order: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await orderModel.getOrders();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ orders: orders }));
  } catch (error) {
    console.error("Error getting orders: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};

exports.deleteOrder = async (req, res) => {
  const orderId = parseInt(req.params.id);
  if (isNaN(orderId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid order id" }));
    return;
  }

  try {
    const orderDeleted = await orderModel.deleteOrder(orderId);
    if (orderDeleted) {
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Order not found" }));
    }
  } catch (error) {
    console.error("Error deleting order: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};
