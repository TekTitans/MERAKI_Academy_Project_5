const pool = require("../models/db");

const checkBlockedUser = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required to check user status.",
    });
  }

  try {
    const query = `SELECT id, is_verified, is_blocked FROM users WHERE email = $1`;
    const result = await pool.query(query, [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email to continue.",
      });
    }

    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Contact support.",
      });
    }

    req.userId = user.id;

    next();
  } catch (error) {
    console.error("Error checking user status:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = checkBlockedUser;
