const express = require("express");

const {
  createCategory,
  updateCategory,
  removeCateegory,
  getAllCategory,
} = require("../controllers/category");

const cateogryRouter = express.Router();

cateogryRouter.post("/", createCategory);
cateogryRouter.put("/:catId", updateCategory);
cateogryRouter.delete("/:catId", removeCateegory);
cateogryRouter.get("/", getAllCategory);


module.exports = cateogryRouter;
