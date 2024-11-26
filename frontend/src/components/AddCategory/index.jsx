import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/reducers/product/product";
import axios from "axios";
import { FaImage } from "react-icons/fa";
import { RingLoader } from "react-spinners";
import "./style.css";
import { setLoading, setError, setMessage } from "../redux/reducers/orders";
const AddCategories = () => {
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

  const { loading, error, message } = useSelector((state) => state.order);
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/category/");
        setCategories(response.data.category);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/subcateogry");
        setSubcategories(response.data.subCategory);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("product_image", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/products/upload_Image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImagePreview(URL.createObjectURL(file));
      setProduct((prevState) => ({
        ...prevState,
        product_image: res.data.url,
      }));
      dispatch(setLoading(false));
      setIsUploading(false);
    } catch (error) {
      dispatch(setError("Failed to upload image. Try again."));
      setIsUploading(false);
    } finally {
      setIsUploading(false);
      dispatch(setLoading(false));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.title || !product.price || !product.category_id) {
      dispatch(setError("Please fill all required fields."));

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

    dispatch(setLoading(true));
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

      dispatch(setMessage("Product added successfully!"));
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
      setImagePreview("");
    } catch (error) {
      dispatch(setError("Failed to add product. Please try again."));
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(setError(null));   
        dispatch(setMessage(null)); 
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);
  

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="product-management-page">
      <h2 className="page-title">Add New Product</h2>
      <div className="add-product-container">
        {error && <div className="error-message">Error: {error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="product__image-container">
            <div className="image-upload">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="product_image"
                />
              ) : (
                <label className="product_image-placeholder">
                  <FaImage size={60} className="image-icon" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <span className="placeholder-text">Upload Image</span>
                </label>
              )}
              {isUploading && (
                <div className="upload-spinner">
                  <RingLoader color="#36d7b7" size={50} />
                </div>
              )}
            </div>
          </div>

          <div className="product__form-container">
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
            <button
              type="submit"
              className="submit-button"
              disabled={loading || isUploading}
            >
              {loading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategories;
