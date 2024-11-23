const pool = require("../models/db");
const express = require("express");
const pdf = require("pdfkit"); // or any other PDF library
const fs = require("fs");

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

const generateInvoice = async (req, res) => {
  const { id: orderId } = req.params;

  try {
    const orderQuery = `
      SELECT 
        o.id AS order_id,
        o.user_id,
        o.total_price,
        o.shipping_address,
        o.created_at,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'product_id', p.id,
            'product_name', p.title,
            'price', p.price,
            'quantity', c.quantity,
            'total', p.price * c.quantity
          )
        ) AS products
      FROM orders o
      JOIN cart c ON o.id = c.order_id
      JOIN products p ON c.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id;
    `;

    const result = await pool.query(orderQuery, [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const order = result.rows[0];
    const doc = new pdf();
    const filename = `invoice-${orderId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    doc.pipe(res);

    doc
      .fontSize(22)
      .text("INVOICE", { align: "center", underline: true })
      .moveDown();

    doc.fontSize(14).text("Order Details", { underline: true });
    doc.fontSize(12).text(`Order ID: ${order.order_id}`);
    doc.text(`Order Date: ${new Date(order.created_at).toLocaleString()}`);
    doc.text(`User ID: ${order.user_id}`);
    doc.moveDown();

    doc.fontSize(14).text("Shipping Information", { underline: true });
    doc.fontSize(12).text(`Address: ${order.shipping_address}`);
    doc.moveDown();

    let rowYH = doc.y;

    doc.rect(50, rowYH, 500, 20).fill("#f0f0f0").stroke();

    const columnWidths = {
      no: 40,
      name: 200,
      quantity: 60,
      price: 60,
      total: 60,
    };

    doc
      .fillColor("#000")
      .fontSize(12)
      .text("No.", 55, rowYH + 5, { width: columnWidths.no, align: "center" })
      .text("Product Name", 100, rowYH + 5, {
        width: columnWidths.name,
        align: "left",
      })
      .text("Quantity", 310, rowYH + 5, {
        width: columnWidths.quantity,
        align: "center",
      })
      .text("Price", 380, rowYH + 5, {
        width: columnWidths.price,
        align: "center",
      })
      .text("Total", 450, rowYH + 5, {
        width: columnWidths.total,
        align: "center",
      });

    doc.moveDown();

    let rowY = doc.y;

    order.products.forEach((product, index) => {
      const isEvenRow = index % 2 === 0;
      const rowHeight = 20;

      if (isEvenRow) {
        doc
          .rect(50, rowY - 5, 500, rowHeight)
          .fill("#f9f9f9")
          .stroke();
      } else {
        doc
          .rect(50, rowY - 5, 500, rowHeight)
          .fill("#ffffff")
          .stroke();
      }

      doc
        .fillColor("#000")
        .text(`${index + 1}`, 55, rowY, {
          width: columnWidths.no,
          align: "center",
        })
        .text(product.product_name, 100, rowY, {
          width: columnWidths.name,
          align: "left",
        })
        .text(product.quantity.toString(), 310, rowY, {
          width: columnWidths.quantity,
          align: "center",
        })
        .text(`${parseFloat(product.price).toFixed(2)}`, 380, rowY, {
          width: columnWidths.price,
          align: "right",
        })
        .text(
          `${(parseFloat(product.price) * product.quantity).toFixed(2)}`,
          450,
          rowY,
          { width: columnWidths.total, align: "right" }
        );

      rowY += rowHeight;
    });

    doc.moveDown(2);
    doc.rect(350, doc.y, 200, 30).fill("#f0f0f0").stroke();
    doc
      .fillColor("#000")
      .fontSize(12)
      .text("Total Price:", 360, doc.y + 10, { width: 80 })
      .text(`${parseFloat(order.total_price).toFixed(2)}`, 440, doc.y + 10, {
        align: "right",
      });

    doc.moveDown(3);
    doc.fontSize(10).fillColor("#555").text("Thank you for shopping with us!", {
      align: "center",
    });

    doc.end();
  } catch (error) {
    console.error("Error generating invoice:", error);
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
  generateInvoice,
};
