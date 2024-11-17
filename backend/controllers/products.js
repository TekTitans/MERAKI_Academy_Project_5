const e = require("express");
const pool = require("../models/db.js");

const createProduct = async (req, res) => {
  const seller_id = req.token.userId;
  //console.log(seller_id);

  const {
    title,
    description,
    price,
    stock_status,
    stock_quantity,
    color_options,
    size_options,
    product_image,

    category_id,
    subcategory_id,
  } = req.body;

  const query = `INSERT INTO products( title,
  description,
  price,
  stock_status,stock_quantity,color_options,size_options,seller_id,category_id,subcategory_id,product_image)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;

  const data = [
    title,
    description,
    price,
    stock_status,
    stock_quantity,
    color_options,
    size_options,
    seller_id,
    category_id,
    subcategory_id,
    product_image,
  ];

  try {
    const result = await pool.query(query, data);
    res.json({
      success: true,
      message: "product Added",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

const updateProduct = async (req, res) => {
  const seller_id = req.token.userId;
  const productId = req.params.pId;
  const {
    title,
    description,
    price,
    stock_status,
    stock_quantity,
    color_options,
    size_options,
    product_image,
    category_id,
    subcategory_id,
  } = req.body;

  const query = `UPDATE products SET
                 title=COALESCE($1,title),
                 description = COALESCE($2,description),
                 price =COALESCE($3,price),
                 stock_status=COALESCE($4,stock_status),
                 stock_quantity=COALESCE($5,stock_quantity),
                 color_options=COALESCE($6,color_options),
                 size_options=COALESCE($7,size_options),
                 product_image=COALESCE($8,product_image),
                 category_id=COALESCE($9,category_id),
                 subcategory_id=COALESCE($10,subcategory_id) WHERE id = ${productId} AND seller_id = ${seller_id} RETURNING *;`;

  const data = [
    title,
    description,
    price,
    stock_status,
    stock_quantity,
    color_options,
    size_options,
    product_image,
    category_id,
    subcategory_id,
  ];
  try {
    const result = await pool.query(query, data);

    if (result.rows.length !== 0) {
      res.json({
        success: true,
        message: "product Updated",
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

const removeProduct = async (req, res) => {
  const productId = req.params.pId;

  const seller_id = req.token.userId;

  const query = `DELETE FROM products WHERE id = $1 AND seller_id = $2;`;

  const data = [productId, seller_id];

  try {
    const result = await pool.query(query, data);
    if (result.rows.length !== 0) {
      res.json({
        success: true,
        message: "product Deleted",
      });
    } else {
      throw new Error("Error happened while updating Category");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

const getAllProducts = async (req, res) => {
  const pageSize = parseInt(req.query.size) || 10;
  const query = `SELECT * FROM products LIMIT $1 ;`;
  const data = [pageSize];
  try {
    const result = await pool.query(query, data);

    res.json({
      success: true,
      message: "All products",
      result: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

// const getAllProducts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Current page (default is 1)
//     const pageSize = parseInt(req.query.size) || 10; // Items per page (default is 10)
//     const offset = (page - 1) * pageSize; // Calculate the offset

//     // Fetch products for the current page
//     const products = await pool.query(
//       "SELECT * FROM products LIMIT $1 OFFSET $2",
//       [pageSize, offset]
//     );

//     // Fetch total product count
//     const  count  = await pool.query(
//       "SELECT COUNT(*) AS count FROM products"
//     );

//     // Send response
//     res.json({
//       "products":products.rows,
//       totalPages: Math.ceil(count / pageSize),
//       currentPage: page,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// };

const getProductById = async (req, res) => {
  const productId = req.params.pId;
  const query = `SELECT * FROM products WHERE id = $1`;

  const data = [productId];
  try {
    const result = await pool.query(query, data);
    if (result.rows.length !== 0) {
      res.json({
        success: true,
        message: "product Details",
        product: result.rows[0],
      });
    } else {
      throw new Error("Error happened while updating Category");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

const getSellerProduct = async (req, res) => {
  const seller_id = req.token.userId;
  const query = `SELECT * FROM products WHERE id = $1`;

  const data = [seller_id];
  try {
    const result = await pool.query(query, data);
    if (result.rows.length !== 0) {
      res.json({
        success: true,
        message: "seller products Details",
        product: result.rows,
      });
    } else {
      throw new Error("Error happened while updating Category");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  const category_id = req.params.cId;
  const query = `SELECT * FROM products WHERE category_id = $1 `;
  const data = [category_id];

  try {
    const result = await pool.query(query, data);
    console.log(result.rows.length);

    if (result.rows.length == 0) {
      res.json({
        success: false,
        message: "no product with this category",
      });
    } else {
      res.json({
        success: true,
        message: "product Details",
        product: result.rows,
      });
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

const getProductByName = async (req, res) => {
  const name = req.params.title;
  const query = `SELECT * FROM products WHERE title = $1 `;
  const data = [name];

  try {
    const result = await pool.query(query, data);
    if (result.rows.length == 0) {
      res.json({
        success: false,
        message: "no product with this title",
      });
    } else {
      res.json({
        success: true,
        message: "product Details",
        product: result.rows,
      });
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

module.exports = {
  createProduct,
  updateProduct,
  removeProduct,
  getAllProducts,
  getProductById,
  getSellerProduct,
  getProductsByCategory,
  getProductByName,
};
