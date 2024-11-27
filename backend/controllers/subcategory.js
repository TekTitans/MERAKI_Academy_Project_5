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
      console.log("Request body:", req.body);
      console.log("SubCategory ID:", req.params.id);

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

const removeSubCategory = async (req, res) => {
  const catId = req.params.catId;

  if (isNaN(subCatId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid subcategory ID",
    });
  }

  const query = `DELETE FROM subcategories WHERE id = $1;`;

  try {
    const result = await pool.query(query, [subCatId]);

    if (result.rowCount > 0) {
      res.json({
        success: true,
        message: "Subcategory deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error.message,
    });
  }
};

const getAllSubCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const offset = (page - 1) * size;

  const query = `
    SELECT s.id, s.name, s.description, s.category_id, c.name AS category_name
    FROM subcategories s
    JOIN categories c ON c.id = s.category_id
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2;
  `;
  const countQuery = `SELECT COUNT(*) FROM subcategories;`;

  try {
    const result = await pool.query(query, [size, offset]);

    const countResult = await pool.query(countQuery);
    const totalSubcategories = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      message: "All Subcategories",
      subCategory: result.rows,
      totalSubcategories: totalSubcategories,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error.message,
    });
  }
};

const getAllSubCategoryByCategoryId = async (req, res) => {
  const { categoryId } = req.params; // Get category ID from route parameters
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const offset = (page - 1) * size;

  // Modified query to filter by category ID
  const query = `
    SELECT s.id, s.name, s.description, s.category_id, c.name AS category_name
    FROM subcategories s
    JOIN categories c ON c.id = s.category_id
    WHERE s.category_id = $1
    LIMIT $2 OFFSET $3;
  `;

  // Count query to get total subcategories for the specified category
  const countQuery = `
    SELECT COUNT(*) 
    FROM subcategories 
    WHERE category_id = $1;
  `;

  try {
    // Fetch subcategories for the given category ID with pagination
    const result = await pool.query(query, [categoryId, size, offset]);

    // Fetch total count of subcategories for the given category ID
    const countResult = await pool.query(countQuery, [categoryId]);
    const totalSubcategories = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      message: `Subcategories for category ID: ${categoryId}`,
      subCategory: result.rows,
      totalSubcategories: totalSubcategories,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error.message,
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
  removeSubCategory,
  getAllSubCategory,
  uploadSubCategoryImage,
  getAllSubCategoryByCategoryId,
};
