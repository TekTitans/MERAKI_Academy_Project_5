const jwt = require("jsonwebtoken");
const pool = require("../models/db");

const authentication = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: No token provided" });
    }

    const token = req.headers.authorization.split(" ").pop();

    jwt.verify(token, process.env.SECRET, async (err, result) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "The token is invalid or expired",
        });
      }

      req.token = result;

      const userId = req.token.userId;
      try {
        const query = `SELECT is_verified, is_blocked FROM users WHERE id = $1`;
        const result = await pool.query(query, [userId]);
        const user = result.rows[0];

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        if (!user.is_verified) {
          return res.status(403).json({
            success: false,
            message: "Please verify your email to continue",
          });
        }

        if (user.is_blocked) {
          return res.status(403).json({
            success: false,
            message: "Your account is blocked. Contact support",
          });
        }

        next();
      } catch (statusError) {
        console.error("Error checking user status:", statusError);
        res.status(500).json({
          success: false,
          message: "Server error. Please try again later",
        });
      }
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(403).json({ success: false, message: "Forbidden" });
  }
};

module.exports = authentication;
