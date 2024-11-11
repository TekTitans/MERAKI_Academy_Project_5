require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models/db");

const app = express();
const PORT = process.env.PORT || 5000;
const cateogryRouter = require("./routes/cateogry");
const subcategoriesRouter = require("./routes/subcategory");
const productRouter = require("./routes/products");

app.use(cors());
app.use(express.json());

app.use("/category", cateogryRouter);
app.use("/subcateogry", subcategoriesRouter);
app.use("/products", productRouter);
// Handles any other endpoints [unassigned - endpoints]
app.use("*", (req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
