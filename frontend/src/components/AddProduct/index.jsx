import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/reducers/product/product";
import axios from "axios";
import "./style.css"
const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock_status: "in_stock",
    stock_quantity: "",
    color_options: "",
    size_options: "",
    product_image: "",
    category_id: "",
    subcategory_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [message, setMessage] = useState(null); 
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/category/");
        setCategories(response.data.category);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/subcateogry");
        setSubcategories(response.data.subCategory);
      } catch (error) {
        console.error("Error fetching subcategories", error);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });

    if (name === "category_id") {
      setFilteredSubcategories(
        subcategories.filter(
          (subcategory) => subcategory.category_id === parseInt(value)
        )
      );
      setProduct((prev) => ({ ...prev, subcategory_id: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage({ text: "Authentication token is missing.", type: "error" });
      return;
    }

    const colorOptionsArray = product.color_options
      ? product.color_options.split(",").map((opt) => opt.trim())
      : [];
    const sizeOptionsArray = product.size_options
      ? product.size_options.split(",").map((opt) => opt.trim())
      : [];

    const formattedProduct = {
      ...product,
      stock_status: product.stock_status.toLowerCase(),
      category_id: parseInt(product.category_id, 10),
      subcategory_id: parseInt(product.subcategory_id, 10),
      price: parseFloat(product.price).toFixed(2),
      stock_quantity: parseInt(product.stock_quantity, 10),
      color_options: colorOptionsArray,
      size_options: sizeOptionsArray,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/products",
        formattedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({ text: "Product added successfully!", type: "success" });
      dispatch(addProduct(response.data.product));
      setProduct({
        title: "",
        description: "",
        price: "",
        stock_status: "in_stock",
        stock_quantity: "",
        color_options: "",
        size_options: "",
        product_image: "",
        category_id: "",
        subcategory_id: "",
      });
    } catch (error) {
      console.error("Error adding product", error);
      setMessage({
        text:
          error.response?.data?.err?.detail ||
          "Failed to add product. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="add-product-container">
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="title"
          value={product.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="number"
          name="stock_quantity"
          value={product.stock_quantity}
          onChange={handleChange}
          placeholder="Stock Quantity"
          required
        />
        <select
          name="stock_status"
          value={product.stock_status}
          onChange={handleChange}
          required
        >
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="on_demand">On Demand</option>
        </select>
        <input
          type="text"
          name="color_options"
          value={product.color_options}
          onChange={handleChange}
          placeholder="Color Options"
        />
        <input
          type="text"
          name="size_options"
          value={product.size_options}
          onChange={handleChange}
          placeholder="Size Options"
        />
        <input
          type="text"
          name="product_image"
          value={product.product_image}
          onChange={handleChange}
          placeholder="Product Image URL"
        />
        <select
          name="category_id"
          value={product.category_id}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          name="subcategory_id"
          value={product.subcategory_id}
          onChange={handleChange}
          required
          disabled={!product.category_id}
        >
          <option value="" disabled>
            {product.category_id
              ? "Select Subcategory"
              : "Select a category first"}
          </option>
          {filteredSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
        <button type="submit" className="submit-button">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
