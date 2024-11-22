const pool = require("../models/db");

const createOrder = async (req, res) => {
  const userId = req.token.userId;
  const { shippingAddress } = req.body;
  try {
    const cartQuery =
      "SELECT * FROM cart WHERE user_id = $1 AND is_deleted = false";
    const cartResult = await pool.query(cartQuery, [userId]);
    if (cartResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }
    const totalAmountQuery = `
              SELECT SUM(p.price * c.quantity) AS total_amount
              FROM cart c
              JOIN products p ON c.product_id = p.id
              WHERE c.user_id = $1 AND c.is_deleted = false
            `;
    const totalAmountResult = await pool.query(totalAmountQuery, [userId]);
    const totalAmount = totalAmountResult.rows[0].total_amount;
    const orderQuery =
      "INSERT INTO orders (user_id, total_price, shipping_address) VALUES ($1, $2, $3) RETURNING id";
    const orderResult = await pool.query(orderQuery, [
      userId,
      totalAmount,
      shippingAddress,
    ]);
    const orderId = orderResult.rows[0].id;
    const updateCartQuery =
      "UPDATE cart SET order_id = $1, is_deleted = true WHERE user_id = $2 AND is_deleted = false";
    await pool.query(updateCartQuery, [orderId, userId]);
    res.status(200).json({
      success: true,
      message: "Order placed successfully.",
      orderId,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
const getAllOrders = (req, res) => {
  const query = `SELECT * FROM orders;`;

  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Orders selected successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message || err,
      });
    });
};
const getOrderDetails = (req, res) => {
  order_id = req.params.id;

  const query = `SELECT price ,quantity ,title,description 
FROM cart
FULL OUTER JOIN orders
ON cart.order_id= orders.id JOIN products on cart.product_id=products.id
WHERE order_id=$1;`;
  const data = [order_id];

  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "orders selected successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
const cancelOrder = (req, res) => {
  order_id = req.params.id;
  const query = `DELETE FROM orders WHERE id=$1  ;`;
  const data = [order_id];

  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "orders removed successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

const getSellerOrders = (req, res) => {
  const sellerId = 78;

  const query = `
    SELECT o.id AS order_id, o.user_id, o.total_price, o.order_status, o.shipping_address, 
           o.payment_status, o.created_at, o.updated_at
    FROM orders o
    JOIN cart c ON o.id = c.order_id
    JOIN products p ON c.product_id = p.id
    WHERE p.seller_id = $1
      AND o.is_deleted = FALSE
    GROUP BY o.id
    ORDER BY o.created_at DESC;
  `;

  const data = [sellerId];

  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Orders retrieved successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message || err,
      });
    });
};

module.exports = {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderDetails,
  getSellerOrders,
};
