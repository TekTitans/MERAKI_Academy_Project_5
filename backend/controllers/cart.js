const pool = require("../models/db");

const addToCart = async (req, res) => {
  const { quantity } = req.body;
  const userId = req.token.userId;
  const productId = req.params.id;

  try {
    const productQuery = "SELECT id, title, price FROM products WHERE id = $1";
    const productResult = await pool.query(productQuery, [productId]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    const product = productResult.rows[0];

    const checkQuery =
      "SELECT * FROM cart WHERE product_id = $1 AND user_id = $2 AND is_deleted = false";
    const checkResult = await pool.query(checkQuery, [productId, userId]);

    if (checkResult.rows.length > 0) {
      const existingQuantity = checkResult.rows[0].quantity;
      const newQuantity = existingQuantity + parseInt(quantity, 10);

      const updateQuery =
        "UPDATE cart SET quantity = $3, updated_at = NOW() WHERE user_id = $1 AND product_id = $2 AND is_deleted = false";
      await pool.query(updateQuery, [userId, productId, newQuantity]);

      return res.status(200).json({
        success: true,
        message: "Product quantity updated in your cart.",
        product: { ...product, quantity: newQuantity },
      });
    }

    const insertQuery =
      "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)";
    await pool.query(insertQuery, [userId, productId, parseInt(quantity, 10)]);

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully.",
      product: { ...product, quantity: parseInt(quantity, 10) },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const removeFromCart = async (req, res) => {
  const userId = req.token.userId;
  const productId = req.params.id;

  try {
    const checkQuery =
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2 AND is_deleted = false";
    const checkResult = await pool.query(checkQuery, [userId, productId]);

    if (!checkResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    const deleteQuery =
      "DELETE FROM cart WHERE user_id = $1 AND product_id = $2";
    await pool.query(deleteQuery, [userId, productId]);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const getCartItems = async (req, res) => {
  const userId = req.token.userId;

  try {
    const query = `
      SELECT 
        t1.price,
        t1.id,
        t1.product_image,
        t1.description, 
        t2.quantity,
        t1.title,
        t2.product_id
      FROM 
        products t1
      INNER JOIN 
        cart t2
      ON 
        t1.id = t2.product_id
      WHERE 
        t2.user_id = $1 AND t2.is_deleted = false
    `;
    const result = await pool.query(query, [userId]);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully.",
      result: result.rows,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const clearCart = async (req, res) => {
  const userId = req.token.userId;

  try {
    const clearQuery = `
      UPDATE cart
      SET is_deleted = true
      WHERE user_id = $1 AND is_deleted = false
    `;
    await pool.query(clearQuery, [userId]);

    res.status(200).json({
      success: true,
      message: "All items removed from cart.",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const updateCartQuantity = async (req, res) => {
  const { quantity } = req.body;
  const userId = req.token.userId;
  const productId = req.params.id;

  try {
    const checkQuery =
      "SELECT * FROM cart WHERE product_id = $1 AND user_id = $2 AND is_deleted = false";
    const checkResult = await pool.query(checkQuery, [productId, userId]);

    if (!checkResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    const updateQuery =
      "UPDATE cart SET quantity = $3, updated_at = NOW() WHERE user_id = $1 AND product_id = $2 AND is_deleted = false";
    await pool.query(updateQuery, [userId, productId, parseInt(quantity, 10)]);

    return res.status(200).json({
      success: true,
      message: "Product quantity updated successfully.",
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCartItems,
  clearCart,
  updateCartQuantity,
};
