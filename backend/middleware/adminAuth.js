const pool = require("../models/db");

const adminAuth = async (req, res, next) => {
  try {
    const userId = req.token.userId;

    const query = "SELECT role_id FROM users WHERE id = $1";
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const roleId = result.rows[0].role_id;

    if (roleId === 1) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = adminAuth;
