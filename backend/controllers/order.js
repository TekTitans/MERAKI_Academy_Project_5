const pool = require("../models/db");
const express = require("express");
const pdf = require("pdfkit");
const fs = require("fs");

const createOrder = async (req, res) => {
  const userId = req.token.userId;
  const shippingAddress = "amman";
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
const getSellerSummary = async (req, res) => {
  const sellerId = req.token.userId;

  try {
    console.log("getSellerSummary");

    const summaryQuery = `
      SELECT 
        COUNT(o.id) AS total_orders,
        SUM(CASE WHEN o.order_status = 'pending' THEN 1 ELSE 0 END) AS pending_orders,
        SUM(CASE WHEN o.order_status = 'shipped' THEN 1 ELSE 0 END) AS shipped_orders,
        SUM(CASE WHEN o.order_status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
        SUM(CASE WHEN o.order_status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed_orders,
        SUM(CASE WHEN o.order_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders,
        COALESCE(SUM(p.price * c.quantity), 0) AS total_sales,
        COUNT(DISTINCT p.id) AS total_products,
        SUM(CASE WHEN p.stock_status = 'out_of_stock' THEN 1 ELSE 0 END) AS out_of_stock_products,
        COUNT(DISTINCT o.user_id) AS total_customers
      FROM orders o
      JOIN cart c ON o.id = c.order_id
      JOIN products p ON c.product_id = p.id
      WHERE p.seller_id = $1 AND o.is_deleted = FALSE AND p.is_deleted = FALSE;
    `;

    const topSellingQuery = `
      SELECT 
        p.title AS top_selling_product,
        SUM(c.quantity) AS units_sold
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE p.seller_id = $1 AND p.is_deleted = FALSE
      GROUP BY p.id
      ORDER BY units_sold DESC
      LIMIT 1;
    `;
    const reviewQuery = ` SELECT 
      COUNT(*) AS total_reviews,
      AVG(reviews.rating) AS average_rating
    FROM sellerReviews reviews
    WHERE reviews.seller_id = $1
      AND reviews.is_deleted = false;
    `;

    const summaryResult = await pool.query(summaryQuery, [78]); //sellerId
    const topSellingResult = await pool.query(topSellingQuery, [78]); //sellerId
    const reviewResult = await pool.query(reviewQuery, [78]); //sellerId

    console.log("reviewResult", reviewResult);
    const summary = summaryResult.rows[0];
    const topSellingProduct = topSellingResult.rows[0] || {
      top_selling_product: null,
      units_sold: 0,
    };
    const totalReviews = reviewResult.rows[0].total_reviews;
    const averageRating = reviewResult.rows[0].average_rating;

    res.status(200).json({
      success: true,
      message: "Seller summary retrieved successfully",
      summary: {
        totalOrders: parseInt(summary.total_orders, 10),
        pendingOrders: parseInt(summary.pending_orders, 10),
        shippedOrders: parseInt(summary.shipped_orders, 10),
        completedOrders: parseInt(summary.completed_orders, 10),
        confirmedOrders: parseInt(summary.confirmed_orders, 10),
        cancelledOrders: parseInt(summary.cancelled_orders, 10),
        totalSales: parseFloat(summary.total_sales).toFixed(2),
        totalProducts: parseInt(summary.total_products, 10),
        outOfStockProducts: parseInt(summary.out_of_stock_products, 10),
        totalCustomers: parseInt(summary.total_customers, 10),
        topSellingProduct: {
          name: topSellingProduct.top_selling_product,
          unitsSold: parseInt(topSellingProduct.units_sold, 10),
        },
        totalReviews: parseInt(totalReviews, 10),
        averageRating: parseFloat(averageRating),
      },
    });
  } catch (err) {
    console.error("Error fetching seller summary:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message || err,
    });
  }
};
const getAdminSummary = async (req, res) => {
  try {
    console.log("Fetching Admin Summary");

    const queries = {
      summary: `
        SELECT 
          (SELECT COUNT(*) FROM users WHERE is_deleted = FALSE) AS total_users,
          (SELECT COUNT(*) FROM users WHERE is_deleted = FALSE AND is_blocked = TRUE) AS blocked_users,
          (SELECT COUNT(*) FROM users WHERE is_deleted = FALSE AND created_at >= NOW() - INTERVAL '7 days') AS new_users,
          (SELECT COUNT(*) FROM products WHERE is_deleted = FALSE) AS total_products,
          (SELECT COUNT(*) FROM orders WHERE is_deleted = FALSE) AS total_orders,
          (SELECT COUNT(*) FROM orders WHERE order_status = 'pending' AND is_deleted = FALSE) AS pending_orders,
          (SELECT COUNT(*) FROM orders WHERE order_status = 'completed' AND is_deleted = FALSE) AS completed_orders,
          (SELECT COALESCE(SUM(products.price * cart.quantity), 0) 
           FROM orders
           JOIN cart ON orders.id = cart.order_id
           JOIN products ON cart.product_id = products.id
           WHERE orders.is_deleted = FALSE AND products.is_deleted = FALSE) AS total_revenue
      `,
      topSellingProduct: `
        SELECT 
          p.title AS top_selling_product,
          SUM(c.quantity) AS units_sold
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE p.is_deleted = FALSE
        GROUP BY p.id
        ORDER BY units_sold DESC
        LIMIT 1;
      `,
      mostReviewedProducts: `
        SELECT 
          p.title AS product_name,
          COUNT(r.id) AS review_count
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        WHERE r.is_deleted = FALSE
        GROUP BY p.id
        ORDER BY review_count DESC
        LIMIT 5;
      `,
      lowStockProducts: `
        SELECT 
          p.title AS product_name, 
          p.stock_quantity
        FROM products p
        WHERE p.is_deleted = FALSE AND p.stock_quantity < 10
        ORDER BY p.stock_quantity ASC
        LIMIT 10;
      `,
      revenueByCategory: `
        SELECT 
          c.name AS category_name,
          SUM(p.price * cart.quantity) AS revenue
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN cart ON p.id = cart.product_id
        WHERE p.is_deleted = FALSE
        GROUP BY c.name
        ORDER BY revenue DESC;
      `,
      orderConversionRate: `
        SELECT 
          COUNT(*) FILTER (WHERE order_status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0) AS conversion_rate
        FROM orders
        WHERE is_deleted = FALSE;
      `,
      averageOrderValue: `
        SELECT 
          COALESCE(AVG(total_price), 0) AS average_value
        FROM (
          SELECT SUM(p.price * c.quantity) AS total_price
          FROM orders o
          JOIN cart c ON o.id = c.order_id
          JOIN products p ON c.product_id = p.id
          WHERE o.is_deleted = FALSE AND p.is_deleted = FALSE
          GROUP BY o.id
        ) AS order_totals;
      `,

      geographicDistribution: `
        SELECT 
          u.country, 
          COUNT(*) AS user_count
        FROM users u
        WHERE u.is_deleted = FALSE
        GROUP BY u.country
        ORDER BY user_count DESC;
      `,
      bestProduct: `
      SELECT 
        p.title AS product_name, 
        AVG(r.rating) AS average_rating
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.is_deleted = FALSE
      GROUP BY p.id
      ORDER BY average_rating DESC
      LIMIT 1;
    `,
      bestSeller: `
      SELECT 
        u.userName AS seller_name, 
        AVG(sr.rating) AS average_rating
      FROM sellerReviews sr
      JOIN users u ON sr.seller_id = u.id
      WHERE sr.is_deleted = FALSE
      GROUP BY u.id
      ORDER BY average_rating DESC
      LIMIT 1;
    `,
    };

    // Execute all queries concurrently
    const [
      summaryResult,
      topSellingResult,
      mostReviewedResult,
      lowStockResult,
      revenueByCategoryResult,
      conversionRateResult,
      averageOrderValueResult,
      geographicDistributionResult,
      bestProductResult,
      bestSellerResult,
    ] = await Promise.all([
      pool.query(queries.summary),
      pool.query(queries.topSellingProduct),
      pool.query(queries.mostReviewedProducts),
      pool.query(queries.lowStockProducts),
      pool.query(queries.revenueByCategory),
      pool.query(queries.orderConversionRate),
      pool.query(queries.averageOrderValue),
      pool.query(queries.geographicDistribution),
      pool.query(queries.bestProduct),
      pool.query(queries.bestSeller),
    ]);

    // Extract and format results
    const summary = summaryResult.rows[0];
    const topSellingProduct = topSellingResult.rows[0] || {
      top_selling_product: null,
      units_sold: 0,
    };
    const mostReviewedProducts = mostReviewedResult.rows.map((row) => ({
      name: row.product_name,
      reviews: row.review_count,
    }));
    const lowStockProducts = lowStockResult.rows.map((row) => ({
      name: row.product_name,
      stock: row.stock_quantity,
    }));
    const revenueByCategory = revenueByCategoryResult.rows.map((row) => ({
      category: row.category_name,
      revenue: parseFloat(row.revenue).toFixed(2),
    }));
    const orderConversionRate =
      parseFloat(conversionRateResult.rows[0]?.conversion_rate || 0) * 100;
    const averageOrderValue = parseFloat(
      averageOrderValueResult.rows[0]?.average_value || 0
    ).toFixed(2);
    const geographicDistribution = geographicDistributionResult.rows.map(
      (row) => ({
        country: row.country,
        users: row.user_count,
      })
    );
    const bestProduct = bestProductResult.rows[0] || null;
    const bestSeller = bestSellerResult.rows[0] || null;
    res.status(200).json({
      success: true,
      message: "Admin summary retrieved successfully",
      summary: {
        totalUsers: parseInt(summary.total_users, 10) || 0,
        totalProducts: parseInt(summary.total_products, 10) || 0,
        totalOrders: parseInt(summary.total_orders, 10) || 0,
        pendingOrders: parseInt(summary.pending_orders, 10) || 0,
        completedOrders: parseInt(summary.completed_orders, 10) || 0,
        totalRevenue: parseFloat(summary.total_revenue || 0).toFixed(2),
        totalReviews: parseInt(summary.total_reviews || 0, 10),
        topSellingProduct: {
          name: topSellingProduct.top_selling_product,
          unitsSold: parseInt(topSellingProduct.units_sold || 0, 10),
        },
        bestProduct: null, // Placeholder; modify if needed
        bestSeller: null, // Placeholder; modify if needed
        blockedUsers: parseInt(summary.blocked_users, 10) || 0,
        newUsers: parseInt(summary.new_users, 10) || 0,
        activeUsers: parseInt(summary.active_users, 10) || 0,
        orderConversionRate,
        averageOrderValue,
        lowStockProducts,
        mostReviewedProducts,
        revenueByCategory,
        geographicDistribution,
        bestProduct: bestProduct
          ? {
              name: bestProduct.product_name,
              averageRating: parseFloat(bestProduct.average_rating).toFixed(2),
            }
          : null,
        bestSeller: bestSeller
          ? {
              name: bestSeller.seller_name,
              averageRating: parseFloat(bestSeller.average_rating).toFixed(2),
            }
          : null,
      },
    });
  } catch (err) {
    console.error("Error fetching admin summary:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message || err,
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
  getSellerSummary,
  getAdminSummary,
};
