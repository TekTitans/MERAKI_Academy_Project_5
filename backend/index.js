require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models/db");

const app = express();
const PORT = process.env.PORT || 5000;
const cateogryRouter = require("./routes/cateogry");
const subcategoriesRouter = require("./routes/subcategory");

app.use(cors());
app.use(express.json());

app.use("/category", cateogryRouter);
app.use("/subcateogry", subcategoriesRouter);
// Handles any other endpoints [unassigned - endpoints]
app.use("*", (req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
