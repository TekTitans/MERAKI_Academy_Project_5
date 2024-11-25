import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  updateProduct,
  removeProduct,
} from "../redux/reducers/product/product";
import { setLoading, setError, setMessage } from "../redux/reducers/orders";
import "./style.css";
import EditProductForm from "../ProductEdit";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
  const { loading, error, message } = useSelector((state) => state.order);
  const [imagePreview, setImagePreview] = useState("");
  const products = useSelector((state) => state.product.products);
  const { token } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState(null);

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
        `http://localhost:5000/products/seller?page=${page}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.products) {
        dispatch(setProducts(response.data.products));
        console.log(response.data);
      }
      setTotalPages(Math.ceil(response.data.totalProducts / pageSize));

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Error fetching seller products"));
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [dispatch, token, currentPage]);

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
      dispatch(setMessage("Product updated successfully!"));
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
      dispatch(setMessage("Product deleted successfully!"));
      dispatch(removeProduct(productId));
      fetchProducts(currentPage);
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

  const paginationControls = (
    <div className="pagination-controls">
      <div
        className={`pagination-arrow ${
          currentPage === 1 || totalPages === 0 ? "disabled" : ""
        }`}
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        aria-disabled={currentPage === 1}
      >
        <FaArrowLeft size={20} />
      </div>
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      <div
        className={`pagination-arrow ${
          currentPage === totalPages || totalPages === 0 ? "disabled" : ""
        }`}
        onClick={() =>
          currentPage < totalPages && setCurrentPage(currentPage + 1)
        }
        aria-disabled={currentPage === totalPages}
      >
        <FaArrowRight size={20} />
      </div>
    </div>
  );

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
    <div className="seller-page">
      <h2 className="page-title">Products Management</h2>
      {error && <div className="error-message">Error: {error}</div>}
      {message && <div className="success-message">{message}</div>}
      {editProduct ? (
        <EditProductForm
          product={product}
          imagePreview={imagePreview}
          isUploading={isUploading}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleUpdate={handleUpdate}
          setEditProduct={setEditProduct}
        />
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
                      {prod.description || "No Description"}
                    </p>

                    <p className="SDB_product-price">
                      {prod.price ? `$${prod.price}` : "Price Not Available"}
                    </p>

                    <div className="SDB_product-stock">
                      <span className="status">
                        {prod.stock_status
                          ? prod.stock_status.replace("_", " ")
                          : "Status Unknown"}
                      </span>
                      &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
                      <span className="quantity">
                        {prod.stock_quantity || "0"}
                      </span>
                    </div>

                    <p className="SDB_product-colors">
                      <span className="color-list">
                        {prod.color_options && prod.color_options.length > 0
                          ? prod.color_options.join(", ")
                          : "No Colors"}
                      </span>
                    </p>

                    <p className="SDB_product-sizes">
                      <span className="size-list">
                        {prod.size_options && prod.size_options.length > 0
                          ? prod.size_options.join(", ")
                          : "One Size"}
                      </span>
                    </p>

                    <p className="SDB_product-category">
                      {prod.category_name || "Category Not Specified"}
                    </p>

                    <p className="SDB_product-subCategory">
                      {prod.subcategory_name || "Subcategory Not Specified"}
                    </p>

                    <div className="SDB_product-rating">
                      <span>{prod.rating || "No Rating Yet"}</span>{" "}
                      &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                      <span>({prod.number_of_reviews})</span>
                    </div>

                    <div className="product-actions">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="action-button edit-button"
                      >
                        Edit
                      </button>
                      <button onClick={() => setSelectedProduct(prod)}>
                        Statistics
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
          {paginationControls}
        </div>
      )}
      {selectedProduct && (
        <div className="order-details-modal-wrapper">
          <div className="order-details-modal">
            <button
              className="close-button"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>
            <h3>{selectedProduct.title}</h3>
            {selectedReviews ? (
              <div className="reviews-list">
                {selectedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="review-card"
                    data-rating={
                      review.rating >= 4
                        ? "positive"
                        : review.rating === 3
                        ? "neutral"
                        : "negative"
                    }
                  >
                    <div className="profile-wrapper">
                      {review.profile_image ? (
                        <img
                          src={review.profile_image}
                          alt={`${review.user_name}'s profile`}
                          className="review-profile-image"
                        />
                      ) : (
                        <FaUserAlt className="fallback-icon" />
                      )}
                    </div>
                    <div className="review-content">
                      <div className="review-header">
                        <strong>{review.user_name}</strong> -{" "}
                        {formatDate(review.created_at)}
                      </div>
                      {renderStars(review.rating)}
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content">
                <div className="SDB_product-info">
                  <p className="SDB_product-times_ordered">
                    {selectedProduct.total_orders_containing_product > 0
                      ? selectedProduct.total_orders_containing_product
                      : "Not Ordered Yet"}
                  </p>

                  <p className="SDB_product-quantity_ordered">
                    {selectedProduct.quantity_ordered > 0
                      ? selectedProduct.quantity_ordered
                      : "Not Ordered Yet"}
                  </p>

                  <div className="SDB_product-total_revenue">
                    <span>
                      {selectedProduct.total_revenue > 0
                        ? `${(
                            parseFloat(selectedProduct.revenue_percentage) || 0
                          ).toFixed(2)}`
                        : "Not Ordered Yet"}
                    </span>{" "}
                    &nbsp;&nbsp;&nbsp; |&nbsp;&nbsp;&nbsp;
                    <span>
                      {selectedProduct.revenue_percentage > 0 &&
                        `${parseFloat(
                          selectedProduct.revenue_percentage
                        ).toFixed(2)}`}
                    </span>
                  </div>

                  <p className="SDB_product-users_added_to_wishlist">
                    {selectedProduct.users_added_to_wishlist > 0
                      ? selectedProduct.users_added_to_wishlist
                      : "Not Added Yet"}
                  </p>

                  <div className="SDB_product-rating">
                    <span>{selectedProduct.rating || "No Rating Yet"}</span>{" "}
                    <span>{"  "}</span> &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
                    <span>({selectedProduct.number_of_reviews})</span>
                  </div>

                  <div className="SDB_product-reviews">
                    {selectedProduct.reviews &&
                    selectedProduct.reviews.length > 0 ? (
                      <button
                        onClick={() =>
                          setSelectedReviews(selectedProduct.reviews)
                        }
                        className="cancel"
                      >
                        Reviews
                      </button>
                    ) : (
                      "No Reviews Yet"
                    )}

                   
                  </div>
                </div>
              </div>
            )}

            <div className="footer">
              <button
                onClick={() => setSelectedProduct(null)}
                className="cancel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
