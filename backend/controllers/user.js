const pool = require("../models/db");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const saltRounds = parseInt(process.env.SALT);
const crypto = require("crypto");

const register = async (req, res) => {
  const { first_Name, last_Name, username, role_id, country, email, password } =
    req.body;

  if (
    !first_Name ||
    !last_Name ||
    !username ||
    !role_id ||
    !country ||
    !email ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*?&])[A-Za-z\d$@!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long, include at least one letter, one number, and one special character.",
    });
  }

  try {
    const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [
      email.toLowerCase(),
    ]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "The email already exists.",
      });
    }

    const usernameCheckQuery = "SELECT * FROM users WHERE username = $1";
    const usernameCheckResult = await pool.query(usernameCheckQuery, [
      username,
    ]);

    if (usernameCheckResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "The username already exists.",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(verificationToken, saltRounds);

    const query = `INSERT INTO users (first_Name, last_Name, username, country, email, password, role_id, verification_token) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const data = [
      first_Name,
      last_Name,
      username,
      country,
      email.toLowerCase(),
      encryptedPassword,
      role_id,
      hashedToken,
    ];

    const result = await pool.query(query, data);
    const newUser = result.rows[0];

    await sendVerificationEmail(username, newUser.email, verificationToken);

    await sendWelcomeEmail(newUser.email, username, newUser.role_id);

    res.status(201).json({
      success: true,
      message:
        "Account created successfully. Please verify your email address.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while creating your account. Please try again later.",
      error: err.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required.",
    });
  }

  try {
    const query = `SELECT * FROM users WHERE is_verified = false AND verification_token IS NOT NULL`;
    const result = await pool.query(query);

    const user = result.rows.find(
      async (user) => await bcrypt.compare(token, user.verification_token)
    );

    if (user) {
      const updateQuery = `UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1`;
      await pool.query(updateQuery, [user.id]);

      return res.status(200).json({
        success: true,
        message: "Email verified successfully.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const sendVerificationEmail = async (username, email, token) => {
  try {
    console.log("username :", username);
    console.log("email :", email);
    console.log("token :", token);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/users/verifyEmail/${token}`;

    const mailOptions = {
      from: `"SmartCart Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address – SmartCart",
      html: `
          <p>Dear ${username},</p>
          <p>Thank you for signing up with SmartCart! To complete your registration, please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify My Email</a></p>
          <p>If you are unable to click the button, you can also copy and paste the following link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>For any questions or if you didn't create this account, please contact our support team at support@smartcart.com.</p>
          <p>Best regards,<br>The SmartCart Team</p>
          <p><strong>SmartCart – Empowering Your E-Commerce Journey</strong></p>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Email sending failed. Please try again later.");
  }
};

const sendWelcomeEmail = async (userEmail, userName, userRole) => {
  try {
    console.log("username :", userName);
    console.log("email :", userEmail);
    console.log("Role :", userRole);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

    let roleSpecificMessage = "";

    if (userRole === 2) {
      roleSpecificMessage = `<p>As a seller, you now have access to a range of features that will help you manage your products, orders, and grow your business on SmartCart.</p><p>We are excited to have you as part of our platform!</p>`;
    } else if (userRole === 3) {
      roleSpecificMessage = `<p>As a customer, you can now browse our wide selection of products, make purchases, and enjoy a seamless shopping experience at SmartCart.</p><p>We are thrilled to have you with us!</p>`;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Welcome to SmartCart – Your E-Commerce Journey Begins!",
      text: `Dear ${userName},\n\nWelcome to SmartCart!\n\nWe are delighted to have you join our platform.\n\n${roleSpecificMessage}\n\nBest regards,\nThe SmartCart Team\n\nSmartCart – Empowering Your E-Commerce Journey`,
      html: `<p>Dear ${userName},</p><p>Welcome to SmartCart!</p><p>We are delighted to have you join our platform.</p>${roleSpecificMessage}<p>Best regards,</p><p>The SmartCart Team</p><p><strong>SmartCart – Empowering Your E-Commerce Journey</strong></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully.");
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = $1`;
  const data = [email.toLowerCase()];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        const user = result.rows[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Server error",
              error: err.message,
            });
          }

          if (isMatch) {
            if (!user.is_active) {
              const reactivateQuery = `UPDATE users SET is_active = TRUE WHERE id = $1 RETURNING *`;
              pool
                .query(reactivateQuery, [user.id])
                .then(() => {
                  const payload = {
                    userId: user.id,
                    country: user.country,
                    role: user.role_id,
                  };
                  const options = { expiresIn: "1d" };
                  const token = jwt.sign(payload, process.env.SECRET, options);

                  return res.status(200).json({
                    token,
                    success: true,
                    message: "Valid login credentials and account reactivated",
                    userId: user.id,
                  });
                })
                .catch((err) => {
                  return res.status(500).json({
                    success: false,
                    message: "Error reactivating account",
                    error: err.message,
                  });
                });
            } else {
              const payload = {
                userId: user.id,
                country: user.country,
                role: user.role_id,
              };
              const options = { expiresIn: "1d" };
              const token = jwt.sign(payload, process.env.SECRET, options);

              return res.status(200).json({
                token,
                success: true,
                message: "Valid login credentials",
                userId: user.id,
              });
            }
          } else {
            return res.status(403).json({
              success: false,
              message: "The password you’ve entered is incorrect",
            });
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "The email doesn’t exist",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    });
};

const getProfile = async (req, res) => {
  const { userId } = req.token;

  try {
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await pool.query(query, [userId]);

    if (result.rows.length) {
      res.status(200).json({
        success: true,
        user: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  const { userId } = req.token;
  const { firstName, lastName, country, location, profile_image } = req.body;

  const fields = [];
  const values = [];
  let index = 1;

  if (firstName) {
    fields.push(`first_name = $${index++}`);
    values.push(firstName);
  }
  if (lastName) {
    fields.push(`last_name = $${index++}`);
    values.push(lastName);
  }
  if (country) {
    fields.push(`country = $${index++}`);
    values.push(country);
  }
  if (location) {
    fields.push(`location = $${index++}`);
    values.push(location);
  }
  if (profile_image) {
    fields.push(`profile_image = $${index++}`);
    values.push(profile_image);
  }

  if (fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields provided to update",
    });
  }

  values.push(userId);

  const query = `UPDATE users SET ${fields.join(
    ", "
  )} WHERE id = $${index} RETURNING *`;

  try {
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.token.userId;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide both old and new passwords.",
    });
  }

  try {
    const query = `SELECT * FROM users WHERE id = $1 AND is_deleted = FALSE`;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*?&])[A-Za-z\d$@!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, include at least one letter, one number, and one special character.",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updateQuery = `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`;
    await pool.query(updateQuery, [encryptedPassword, userId]);

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const deactivateUser = async (req, res) => {
  const { userId } = req.token;
  console.log("userId: ", userId);
  try {
    const query = `UPDATE users SET is_active = FALSE WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [userId]);

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "User account deactivated successfully",
        user: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const reactivateUser = async (req, res) => {
  const { userId } = req.token;

  try {
    const query = `UPDATE users SET is_active = TRUE WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [userId]);

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "User account reactivated successfully",
        user: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const deleteUserAccount = async (req, res) => {
  const { userId } = req.token;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Please provide your current password to delete your account.",
    });
  }

  try {
    const userQuery =
      "SELECT * FROM users WHERE id = $1 AND is_deleted = FALSE";
    const result = await pool.query(userQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or account already deleted.",
      });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const deleteQuery =
      "UPDATE users SET is_deleted = TRUE WHERE id = $1 RETURNING *";
    const deletedUser = await pool.query(deleteQuery, [userId]);

    res.status(200).json({
      success: true,
      message: "Your account has been deleted successfully.",
      user: deletedUser.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const AdminGetAllUsers = async (req, res) => {
  try {
    const query = `SELECT * FROM users WHERE is_deleted = FALSE`;
    const result = await pool.query(query);
    res.status(200).json({
      success: true,
      users: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const AdminRemoveUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `UPDATE users SET is_deleted = TRUE WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [userId]);

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "User removed successfully",
        user: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const AdminBlockUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `UPDATE users SET is_blocked = TRUE WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [userId]);

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "User blocked successfully",
        user: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const AdminUnblockUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `UPDATE users SET is_blocked = FALSE WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [userId]);

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "User unblocked successfully",
        user: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const generateResetToken = (userId) => {
  console.log("User ID type:", typeof userId);

  if (typeof userId !== "string" && typeof userId !== "number") {
    throw new Error("Invalid userId: must be a primitive type");
  }

  const resetToken = jwt.sign({ userId }, process.env.SECRET, {
    expiresIn: "1h",
  });
  return resetToken;
};

const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/users/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Password Reset Request",
      text: `You have requested a password reset. Please click the link below to reset your password:\n\n${resetLink}`,
      html: `<p>You have requested a password reset. Please click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide your email.",
    });
  }

  try {
    const query = `SELECT * FROM users WHERE email = $1 AND is_deleted = FALSE`;
    const result = await pool.query(query, [email.toLowerCase()]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email.",
      });
    }

    const user = result.rows[0];
    const resetToken = generateResetToken(user.id);

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: "Password reset email sent.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  console.log("test");
  const { newPassword, resetToken } = req.body;
  console.log("resetToken : ", resetToken);
  console.log("newPassword : ", newPassword);

  if (!newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide a new password.",
    });
  }

  try {
    const decoded = jwt.verify(resetToken, process.env.SECRET);
    const userId = decoded.userId;

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*?&])[A-Za-z\d$@!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, include at least one letter, one number, and one special character.",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

    const query = `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`;
    const result = await pool.query(query, [encryptedPassword, userId]);

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Password reset successfully.",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  deactivateUser,
  reactivateUser,
  deleteUserAccount,
  AdminGetAllUsers,
  AdminRemoveUser,
  AdminBlockUser,
  AdminUnblockUser,
  forgotPassword,
  resetPassword,
};
