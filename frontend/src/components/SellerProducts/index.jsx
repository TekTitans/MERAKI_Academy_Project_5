import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  updateProduct,
  removeProduct,
} from "../redux/reducers/product/product";
import { setLoading, setError } from "../redux/reducers/orders";
import "./style.css";
import { FaImage } from "react-icons/fa";
import { RingLoader } from "react-spinners";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Pagination from "../ProductsPagination";
const SellerProducts = () => {
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
  const { loading, error } = useSelector((state) => state.order);
  const [imagePreview, setImagePreview] = useState("");
  const products = useSelector((state) => state.product.products);
  const { token } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProducts = async (page = 1) => {
    if (!token) {
      dispatch(setLoading(false));
      dispatch(setError("No token found."));
      return;
    }
    dispatch(setLoading(true));
    dispatch(setError(null));
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
      setTotalPages(Math.ceil(response.data.totalProducts / pageSize));

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Error fetching seller products"));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch, token]);

  const validateForm = () => {
    if (!product.title || !product.price || !product.stock_quantity) {
      dispatch(setLoading(false));
      dispatch(setError("Title, Price, and Stock Quantity are required."));
      return false;
    }
    if (isNaN(product.price) || isNaN(product.stock_quantity)) {
      dispatch(setLoading(false));
      dispatch(setError("Price and Stock Quantity must be numbers."));
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    dispatch(setError(null));
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
      setIsUploading(false);
      setImagePreview(URL.createObjectURL(file));
      setProduct((prevState) => ({
        ...prevState,
        product_image: res.data.url,
      }));
    } catch (error) {
      dispatch(setError("Failed to upload image. Try again."));
      setIsUploading(false);
    } finally {
      setIsUploading(false);
    }
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
    dispatch(setLoading(true));
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
      dispatch(updateProduct(response.data.product));
      setEditProduct(null);
      dispatch(setError("Product updated successfully!"));
      dispatch(setLoading(false));
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
      dispatch(setError("Failed to update product."));
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setLoading(false));
      dispatch(setError("Product deleted successfully!"));
      dispatch(removeProduct(productId));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Failed to delete product."));
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

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="seller-page">
      <h2 className="page-title">Products Management</h2>
      {error && <div className="error-message">Error: {error}</div>}
      {editProduct ? (
        <div className="product-edit-form-container">
          <form onSubmit={handleUpdate} className="product-edit-form">
            <h2>Edit Product</h2>
            <div className="product__picture-container">
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
                    <span className="placeholder-text">Upload Image</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </label>
                )}
                {isUploading && (
                  <div className="upload-spinner">
                    <RingLoader color="#36d7b7" size={50} />
                  </div>
                )}
              </div>
            </div>
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
            <div className="Edit_Action_Btns">
              <button type="submit" className="edit_action-button">
                {loading ? "Updating..." : "Update Product"}
              </button>
              <button
                className="edit_back-button"
                onClick={() => {
                  setEditProduct(null);
                  setIseditProduct(false);
                }}
              >
                Back to Product List
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="SDB_product-list">
          <div className="SDB_product-grid">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : products.length > 0 ? (
              products.map((prod) => (
                <div key={prod.id} className="SDB_product-card">
                  <img
                    src={
                      prod.product_image || "https://via.placeholder.com/150"
                    }
                    alt={prod.title}
                    className="SDB_product-image"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/150")
                    }
                  />
                  <div className="SDB_product-info">
                    <h3 className="SDB_product-title">{prod.title}</h3>
                    <p className="SDB_product-description">
                      {prod.description}
                    </p>
                    <p className="SDB_product-price">${prod.price}</p>
                    <p className="SDB_product-stock">
                      Stock Status: {prod.stock_status} | Quantity:{" "}
                      {prod.stock_quantity}
                    </p>
                    <p className="SDB_product-colors">
                      Colors: {prod.color_options.join(", ")}
                    </p>
                    <p className="SDB_product-sizes">
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />{" "}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
