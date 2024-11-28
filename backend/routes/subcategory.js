const express = require("express");
const auth = require("../middleware/authentication");
const authz = require("../middleware/authorization");
const upload = require("../middleware/upload");
const {
  createSubCategory,
  updateSubCategory,
  removeSubCateegory,
  getAllSubCategory,
  uploadSubCategoryImage,
  getAllSubCategoryByCategoryId,
} = require("../controllers/subcategory.js");

const subcategoriesRouter = express.Router();

subcategoriesRouter.post(
  "/upload_Image",
  auth,
  upload.single("subcategory_image"),
  uploadSubCategoryImage
);
subcategoriesRouter.post("/:catId", auth, createSubCategory);
subcategoriesRouter.put("/:subId", updateSubCategory);
subcategoriesRouter.delete("/:subId", removeSubCateegory);
subcategoriesRouter.get("/", getAllSubCategory);
subcategoriesRouter.get("/:categoryId", auth, getAllSubCategoryByCategoryId);

module.exports = subcategoriesRouter;
