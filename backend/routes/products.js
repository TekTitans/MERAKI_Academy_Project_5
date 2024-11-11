const express = require("express");

const {
  createProduct,
  updateProduct,
  removeProduct,
  getAllProducts,
  getProductById,
  getSellerProduct,
} = require("../controllers/products");

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.put("/:pId", updateProduct);
productRouter.delete("/:pId", removeProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:pId", getProductById);
productRouter.get("/seller", getSellerProduct);
module.exports = productRouter;
