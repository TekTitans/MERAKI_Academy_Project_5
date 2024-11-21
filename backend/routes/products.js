const express = require("express");
const auth = require("../middleware/authentication");
const authz = require("../middleware/authorization");
const upload = require("../middleware/upload");  

const {
  createProduct,
  updateProduct,
  removeProduct,
  getAllProducts,
  getProductById,
  getSellerProduct,
  getProductsByCategory,
  getProductByName,
} = require("../controllers/products");

const productRouter = express.Router();

productRouter.post("/", auth, authz("create_product"), createProduct);
productRouter.put(
  "/:pId",
  auth,
  authz("update_product"),
  upload.single("product_image"),
  updateProduct
);
productRouter.delete("/:pId", auth, authz("delete_product"), removeProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/seller", auth, getSellerProduct);
productRouter.get("/:pId", getProductById);
productRouter.get("/category/:cId", getProductsByCategory);
productRouter.get("/serach/:title", getProductByName);
module.exports = productRouter;
