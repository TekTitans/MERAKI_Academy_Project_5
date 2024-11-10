const pg = require("pg");

const pool = new pg.Pool({
  connectionString: process.env.CONNECTION_STRING,
});

pool
  .connect()
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => {
    console.error("Error connecting to the DB: ", err.message);
  });

module.exports = pool;
