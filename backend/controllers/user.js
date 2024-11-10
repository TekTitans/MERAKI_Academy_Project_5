const pool = require("../models/db");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);

const register = async (req, res) => {
  const { first_Name, last_Name, username, role_id, country, email, password } =
    req.body;

  try {
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    const query = `INSERT INTO users (first_Name, last_Name, username, country, email, password, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const data = [
      first_Name,
      last_Name,
      username,
      country,
      email.toLowerCase(),
      encryptedPassword,
      role_id,
    ];

    await pool.query(query, data);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (err) {
    res.status(409).json({
      success: false,
      message: "The email already exists",
      error: err.message,
    });
  }
};

const login = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const query = `SELECT * FROM users WHERE email = $1`;
  const data = [email.toLowerCase()];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);
          if (response) {
            const payload = {
              userId: result.rows[0].id,
              country: result.rows[0].country,
              role: result.rows[0].role_id,
            };
            const options = { expiresIn: "1d" };
            const secret = process.env.SECRET;
            const token = jwt.sign(payload, secret, options);
            if (token) {
              return res.status(200).json({
                token,
                success: true,
                message: `Valid login credentials`,
                userId: result.rows[0].id,
              });
            } else {
              throw Error;
            }
          } else {
            res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`,
            });
          }
        });
      } else throw Error;
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err,
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

  try {
    const query = `UPDATE users 
                     SET first_name = $1, 
                         last_name = $2, 
                         country = $3, 
                         location = $4, 
                         profile_image = $5 
                     WHERE id = $6 
                     RETURNING *`;

    const data = [
      firstName,
      lastName,
      country,
      location,
      profile_image,
      userId,
    ];

    const result = await pool.query(query, data);

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

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
