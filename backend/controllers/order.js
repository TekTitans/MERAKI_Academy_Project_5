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
const getSellerOrders = async (req, res) => {
  const sellerId = req.token.userId;

  try {
    const query = `
      SELECT 
        o.id AS order_id,
        o.user_id,
        o.shipping_address,
        o.created_at,
        o.updated_at,
        o.order_status,
        o.payment_status,
        SUM(p.price * c.quantity) AS seller_total_price, -- Total price for this seller's products
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'product_id', p.id,
            'product_name', p.title,
            'quantity', c.quantity,
            'price', p.price,
            'total', p.price * c.quantity
          )
        ) AS products
      FROM orders o
      JOIN cart c ON o.id = c.order_id
      JOIN products p ON c.product_id = p.id
      WHERE p.seller_id = $1
        AND o.is_deleted = FALSE
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;

    const data = [78]; //sellerId
    const result = await pool.query(query, data);

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      result: result.rows,
    });
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message || err,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "shipped",
  ];
  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid status. Valid statuses are: pending, confirmed, completed, cancelled, shipped.",
    });
  }

  try {
    const query = `
      UPDATE orders
      SET order_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND is_deleted = FALSE
      RETURNING *;
    `;
    const values = [status.toLowerCase(), id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found or already deleted.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderDetails,
  getSellerOrders,
  updateOrderStatus,
};
