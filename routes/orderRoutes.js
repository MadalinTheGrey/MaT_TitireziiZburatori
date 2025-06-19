const orderController = require("../controllers/orderController");
const { verifyToken } = require("../middleware/authMiddleware");
const adminRole = "admin";

exports.orderRoutes = [
  {
    method: "POST",
    path: "/api/orders",
    middleware: [verifyToken([adminRole])],
    handler: orderController.addOrder,
  },
  {
    method: "GET",
    path: "/api/orders",
    middleware: [verifyToken([adminRole])],
    handler: orderController.getOrders,
  },
  {
    method: "DELETE",
    path: "/api/orders/:id",
    middleware: [verifyToken([adminRole])],
    handler: orderController.deleteOrder,
  },
];
