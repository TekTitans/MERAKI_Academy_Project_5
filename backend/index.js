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
const productRouter = require("./routes/products");
const messagesRouter=require("./routes/messages")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/messages",messagesRouter);
app.use("/users", userRouter);
app.use("/roles", rolesRouter);
app.use("/category", cateogryRouter);
app.use("/subcategory", subcategoriesRouter);
app.use("/products", productRouter);
app.use("/review", reviewRouter);
app.use("/order", orderRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishRouter);

app.use("*", (req, res) => res.status(404).json("NO content at this path"));
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

