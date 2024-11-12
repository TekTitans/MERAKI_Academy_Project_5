const pool = require("../models/db");

const authorization = (permission) => {
  return function (req, res, next) {
    const role_id = req.token.role;
    const data = [role_id, permission];

    const query = `
      SELECT * 
      FROM role_permission RP
      INNER JOIN permissions P ON RP.permission_id = P.id
      WHERE RP.role_id = $1 AND P.permission = $2
    `;

    pool
      .query(query, data)
      .then((result) => {
        if (result.rows.length) {
          next();
        } else {
          res.status(403).json({
            success: false,
            message: "You do not have permission to perform this action.",
          });
        }
      })
      .catch((err) => {
        console.error("Authorization Error:", err);
        res.status(500).json({
          success: false,
          message: "Server error. Please try again later.",
        });
      });
  };
};

module.exports = authorization;
