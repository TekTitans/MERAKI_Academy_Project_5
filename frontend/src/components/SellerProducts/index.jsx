import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  updateProduct,
  removeProduct,
} from "../redux/reducers/product/product";
import "./style.css";

const ProductManagement = () => {
  const [editProduct, setEditProduct] = useState(null);
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

  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });
  const showMessage = (text, type) => {
    setMessage({ text, type });

    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000); // 3000 milliseconds (3 seconds)
  };
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        console.error("No token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/products/seller",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.products) {
          dispatch(setProducts(response.data.products));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching seller products", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch, token]);

  const validateForm = () => {
    if (!product.title || !product.price || !product.stock_quantity) {
      showMessage(
        error.response?.data?.message ||
          "Title, Price, and Stock Quantity are required.",
        "error"
      );
      return false;
    }
    if (isNaN(product.price) || isNaN(product.stock_quantity)) {
      showMessage(
        error.response?.data?.message ||
          "Price and Stock Quantity must be numbers.",
        "error"
      );
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
      color_options: colorOptionsArray,
      size_options: sizeOptionsArray,
      price: parseFloat(product.price).toFixed(2),
      stock_quantity: parseInt(product.stock_quantity, 10),
      category_id: parseInt(product.category_id, 10),
      subcategory_id: parseInt(product.subcategory_id, 10),
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/products/${editProduct.id}`,
        formattedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showMessage("Product updated successfully!", "success");
      dispatch(updateProduct(response.data.product));
      setEditProduct(null);
      setProduct({
        title: "",
        description: "",
        price: "",
        stock_status: "In Stock",
        stock_quantity: "",
        color_options: "",
        size_options: "",
        product_image: "",
        category_id: "",
        subcategory_id: "",
      });
      showMessage("Product updated successfully!", "success");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to update product.",
        "error"
      );
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showMessage("Product deleted successfully!", "success");
      dispatch(removeProduct(productId));
    } catch (error) {
      showMessage("Failed to delete product.", "error");
    }
  };

  const handleEdit = (productToEdit) => {
    setEditProduct(productToEdit);
    setProduct({
      ...productToEdit,
      color_options: productToEdit.color_options.join(", "),
      size_options: productToEdit.size_options.join(", "),
    });
  };

  return (
    <div className="product-management-page">
      <h1 className="page-title">Product Management</h1>
      {message && (
        <div className={`message ${message.type} ${message ? "show" : ""}`}>
          {message.text}
        </div>
      )}

      {editProduct ? (
        <div className="product-edit-form-container">
          <form onSubmit={handleUpdate} className="product-edit-form">
            <h2>Edit Product</h2>
            <button
              className="back-button"
              onClick={() => setEditProduct(null)}
            >
              Back to Product List
            </button>

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={product.title}
                onChange={handleChange}
                placeholder="Title"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Description"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Price"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock_quantity" className="form-label">
                Stock Quantity
              </label>
              <input
                type="text"
                id="stock_quantity"
                name="stock_quantity"
                value={product.stock_quantity}
                onChange={handleChange}
                placeholder="Stock Quantity"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="color_options" className="form-label">
                Color Options (comma separated)
              </label>
              <input
                type="text"
                id="color_options"
                name="color_options"
                value={product.color_options}
                onChange={handleChange}
                placeholder="Color Options (comma separated)"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="size_options" className="form-label">
                Size Options (comma separated)
              </label>
              <input
                type="text"
                id="size_options"
                name="size_options"
                value={product.size_options}
                onChange={handleChange}
                placeholder="Size Options (comma separated)"
                className="input-field"
              />
            </div>

            <button type="submit" className="action-button">
              Update Product
            </button>
          </form>
        </div>
      ) : (
        <div className="products-list">
          <div className="products-grid">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : products.length > 0 ? (
              products.map((prod) => (
                <div key={prod.id} className="product-card">
                  <img
                    src={
                      prod.product_image || "https://via.placeholder.com/150"
                    }
                    alt={prod.title}
                    className="product-image"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/150")
                    }
                  />
                  <div className="product-info">
                    <h3 className="product-title">{prod.title}</h3>
                    <p className="product-description">{prod.description}</p>
                    <p className="product-price">${prod.price}</p>
                    <p className="product-stock">
                      Stock Status: {prod.stock_status} | Quantity:{" "}
                      {prod.stock_quantity}
                    </p>
                    <p className="product-colors">
                      Colors: {prod.color_options.join(", ")}
                    </p>
                    <p className="product-sizes">
                      Sizes: {prod.size_options.join(", ")}
                    </p>
                    <div className="product-actions">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="action-button edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="action-button delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products-message">No products found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
