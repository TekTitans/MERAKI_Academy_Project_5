const pool = require("../models/db");

const createCategory = async (req, res) => {
  const { name, description, category_image } = req.body;
  // console.log(name, description, category_image);

  const query = `INSERT INTO categories (name, description,category_image)VALUES($1,$2,$3)RETURNING *`;
  // console.log(query);

  const data = [name, description, category_image];
  try {
    const result = await pool.query(query, data);
    //console.log(result);

    res.json({
      success: true,
      message: "Category Added",
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

const updateCategory = async (req, res) => {
  const catId = req.params.catId;
  const { name, description, category_image } = req.body;
  const query = `UPDATE categories SET name= COALESCE($1,name),description = COALESCE($2,description),category_image=COALESCE($3,category_image) WHERE id = ${catId} RETURNING *;`;

  const data = [name, description, category_image];
  try {
    const result = await pool.query(query, data);

    if (result.rows.length !== 0) {
      res.json({
        success: true,
        message: "Category Updated",
        category: result.rows[0],
      });
    } else {
      throw new Error("Error happened while updating Category");
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

const removeCateegory = async (req, res) => {
  const catId = req.params.catId;

  const query = `DELETE FROM categories WHERE id = ${catId};`;

  try {
    const result = await pool.query(query);
    if (result.rows.length !== 0) {
      res.json({
        success: true,
        message: "Category Deleted",
      });
    } else {
      throw new Error("Error happened while deleting Category");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

const getAllCategory = async (req, res) => {
  const query = `SELECT * FROM categories;`;

  try {
    const result = await pool.query(query);

    res.json({
      success: true,
      message: "All Category",
      category: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  removeCateegory,
  getAllCategory,
};
