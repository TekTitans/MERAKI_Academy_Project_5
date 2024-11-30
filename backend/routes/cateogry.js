const express = require("express");
const auth = require("../middleware/authentication");
const authz = require("../middleware/authorization");
const upload = require("../middleware/upload");

const {
  createCategory,
  updateCategory,
  removeCategory,
  getAllCategory,
  uploadCategoryImage,
  getCategoryById,
} = require("../controllers/category");

const cateogryRouter = express.Router();

cateogryRouter.post("/", auth, createCategory);
cateogryRouter.post(
  "/upload_Image",
  auth,
  upload.single("category_image"),
  uploadCategoryImage
);

cateogryRouter.put("/:catId", auth, updateCategory);
cateogryRouter.delete("/:catId", auth, removeCategory);
cateogryRouter.get("/", getAllCategory);
cateogryRouter.get("/:catId", getCategoryById);

module.exports = cateogryRouter;
