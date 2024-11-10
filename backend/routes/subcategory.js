const express = require("express");

const {
  createSubCategory,
  updateSubCategory,
  removeSubCateegory,
  getAllSubCategory,
} = require("../controllers/subcategory.js");

const subcategoriesRouter = express.Router();

subcategoriesRouter.post("/:catId", createSubCategory);
subcategoriesRouter.put("/:subId", updateSubCategory);
subcategoriesRouter.delete("/:subId", removeSubCateegory);
subcategoriesRouter.get("/", getAllSubCategory);

module.exports = subcategoriesRouter;
