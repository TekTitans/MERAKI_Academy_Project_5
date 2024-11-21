import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/reducers/product/product";
import axios from "axios";

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
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.auth);
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/category/");
        setCategories(response.data.category);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/subcateogry");
        setSubcategories(response.data.subCategory);
        console.log("response :", response.data.subCategory);
      } catch (error) {
        console.error("Error fetching subcategories", error);
      }
    };
    fetchSubcategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: value,
    });

    if (name === "category_id") {
      setFilteredSubcategories(
        subcategories.filter(
          (subcategory) => subcategory.category_id === parseInt(value)
        )
      );
      setProduct((prevProduct) => ({
        ...prevProduct,
        subcategory_id: "", 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Authentication token is missing.");
      return;
    }

    const colorOptionsArray = product.color_options
      ? product.color_options.split(",").map((option) => option.trim())
      : [];
    const sizeOptionsArray = product.size_options
      ? product.size_options.split(",").map((option) => option.trim())
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

    console.log("Formatted product to submit:", formattedProduct);

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
      alert("Product added successfully!");
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
      if (error.response?.status === 403) {
        alert("Unauthorized: Please log in again.");
      } else if (error.response?.status === 500) {
        alert(
          error.response.data.err.detail ||
            "Server error: Please check your input."
        );
      } else {
        alert("Failed to add product. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
