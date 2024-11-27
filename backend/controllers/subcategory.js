const e = require("express");
const pool = require("../models/db.js");
const cloudinary = require("cloudinary").v2;
const { uploadToCloudinary } = require("../services/cloudinary");
const createSubCategory = async (req, res) => {
  const category_id = req.params.catId;
  const { name, description, subcategory_image } = req.body;
  console.log("name: ", name);
  console.log("description: ", description);
  console.log("subCategory_image: ", subcategory_image);
  console.log("category_id: ", category_id);

  const query = `INSERT INTO subcategories (name, category_id,description,subcategory_image)VALUES($1,$2,$3,$4)RETURNING *`;
  // console.log(query);

  const data = [name, category_id, description, subcategory_image];
  try {
    const result = await pool.query(query, data);
    //console.log(result);
    console.log("result: ", result);

    res.json({
      success: true,
      message: "SubCategory Added",
      category: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

const updateSubCategory = async (req, res) => {
  const subCatId = req.params.subId;
  const { name, description, subcategory_image } = req.body;
  const query = `UPDATE subcategories SET name= COALESCE($1,name),description = COALESCE($2,description),subcategory_image=COALESCE($3,subcategory_image) WHERE id = ${subCatId} RETURNING *;`;

  const data = [name, description, subcategory_image];
  try {
    const result = await pool.query(query, data);

    if (result.rows.length !== 0) {
      res.json({
        success: true,
        message: "subCategory Updated",
        category: result.rows[0],
      });
    } else {
      throw new Error("Error happened while updating SubCategory");
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

const removeSubCateegory = async (req, res) => {
  const subCatIdatId = req.params.subId;

  const query = `DELETE FROM subcategories WHERE id = ${subCatIdatId};`;

  try {
    const result = await pool.query(query);
    if (result.rows.length !== 0) {
      res.json({
        success: true,
        message: "subCategory Deleted",
      });
    } else {
      throw new Error("Error happened while deleting subCategory");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

const getAllSubCategory = async (req, res) => {
  //const query = `SELECT s.name,s.description ,c.name,s.id,c.id FROM subcategories s JOIN categories c ON c.id=s.category_id;`;
  const query = `SELECT * FROM subcategories ; `;

  try {
    const result = await pool.query(query);

    res.json({
      success: true,
      message: "All subCategory",
      subCategory: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

const uploadSubCategoryImage = async (req, res) => {
  const admin_id = req.token.userId;
  console.log("admin_id :", admin_id);

  if (req.file) {
    console.log("File provided in the request.");
    const fileSizeLimit = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png"];

    if (req.file.size > fileSizeLimit) {
      return res
        .status(400)
        .json({ success: false, message: "File is too large" });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid file type" });
    }

    try {
      const uploadResponse = await uploadToCloudinary(req.file.buffer);
      const subcategoryImageUrl = uploadResponse.url;

      console.log("Uploaded SubCategory image URL:", subcategoryImageUrl);

      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        url: subcategoryImageUrl,
      });
    } catch (error) {
      console.error("Error uploading category image:", error);
      return res.status(500).json({
        success: false,
        message: "Error uploading category image.",
        err: error.message,
      });
    }
  }
};

module.exports = {
  createSubCategory,
  updateSubCategory,
  removeSubCateegory,
  getAllSubCategory,
  uploadSubCategoryImage,
};
