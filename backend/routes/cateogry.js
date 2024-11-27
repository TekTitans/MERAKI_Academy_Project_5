const express = require("express");
const auth = require("../middleware/authentication");
const authz = require("../middleware/authorization");
const upload = require("../middleware/upload");

const {
  createCategory,
  updateCategory,
  removeCateegory,
  getAllCategory,
  uploadCategoryImage,
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
cateogryRouter.delete("/:catId", removeCateegory);
cateogryRouter.get("/", getAllCategory);

module.exports = cateogryRouter;
