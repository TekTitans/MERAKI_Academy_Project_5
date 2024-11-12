require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models/db");
const userRouter = require("./routes/user");
const rolesRouter = require("./routes/role");
const cateogryRouter = require("./routes/cateogry");
const subcategoriesRouter = require("./routes/subcategory");
const reviewRouter = require("./routes/review");
const orderRouter = require("./routes/order");
const cartRouter = require("./routes/cart");
const wishRouter = require("./routes/wishlist");

const app = express();
const PORT = process.env.PORT || 5000;
const productRouter = require("./routes/products");

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/roles", rolesRouter);
app.use("/category", cateogryRouter);
app.use("/subcateogry", subcategoriesRouter);
app.use("/products", productRouter);
app.use("/review", reviewRouter);
app.use("/order", orderRouter);
app.use("/cart", cartRouter);

app.use("/wishlist", wishRouter);

app.use("*", (req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
