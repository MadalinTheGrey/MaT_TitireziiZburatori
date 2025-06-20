const supplyController = require("../controllers/supplyController");
const { verifyToken } = require("../middleware/authMiddleware");
const adminRole = "admin";

exports.supplyRoutes = [
  {
    method: "POST",
    path: "/api/supplies",
    middleware: [verifyToken([adminRole])],
    handler: supplyController.addSupply,
  },
  {
    method: "GET",
    path: "/api/supplies",
    middleware: [verifyToken([adminRole])],
    handler: supplyController.getSupplies,
  },
  {
    method: "PATCH",
    path: "/api/supplies/:id",
    middleware: [verifyToken([adminRole])],
    handler: supplyController.updateSupplyStock,
  },
  {
    method: "POST",
    path: "/api/supplies/import",
    middleware: [verifyToken([adminRole])],
    handler: supplyController.importSupplies,
  },
];
