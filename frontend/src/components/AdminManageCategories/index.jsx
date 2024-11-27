import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setMessage } from "../redux/reducers/orders";
import "./style.css";
import EditProductForm from "../ProductEdit";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";

const AdminManageCatigories = () => {
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_image: "",
    subcategory_image: "",
    category_id: "",
    isCategory: true,
  });

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.order);
  const [imagePreview, setImagePreview] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [filters, setFilters] = useState({
    selectedDate: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    status: "",
    selectedCategory: 0,
    selectedSubcategory: 0,
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const [filterRating, setFilterRating] = useState(0);

  const fetchCategories = async (page = 1) => {
    try {
      if (!token) {
        dispatch(setLoading(false));
        dispatch(setError("No token found."));
        return;
      }
      const response = await axios.get(
        `http://localhost:5000/category?page=${page}&size=${pageSize}`
      );
      setTotalPages(Math.ceil(response.data.totalProducts / pageSize));
      dispatch(setLoading(false));
      setCategories(response.data.category);
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Error fetching Categories"));
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (page = 1) => {
    try {
      if (!token) {
        dispatch(setLoading(false));
        dispatch(setError("No token found."));
        return;
      }
      const response = await axios.get(
        `http://localhost:5000/subcateogry?page=${page}&size=${pageSize}`
      );
      setTotalPages(Math.ceil(response.data.totalProducts / pageSize));
      dispatch(setLoading(false));
      setSubcategories(response.data.subCategory);
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Error fetching subcategories"));
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
    fetchSubcategories(currentPage);
  }, [dispatch, token, currentPage, updated, categories]);

  const validateForm = () => {
    if (!formData.name || !formData.description) {
      dispatch(setLoading(false));
      dispatch(setError("name and description are required."));
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e, isCategory = true, categoryId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const formDataToUpload = new FormData();
    const fileKey = isCategory ? "category_image" : "subcategory_image";
    formDataToUpload.append(fileKey, file);

    try {
      const endpoint = isCategory
        ? "http://localhost:5000/category/upload_Image"
        : `http://localhost:5000/subcategory/upload_Image`;

      const res = await axios.post(endpoint, formDataToUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setImagePreview(URL.createObjectURL(file));
      setFormData((prevState) => ({
        ...prevState,
        [fileKey]: res.data.url,
      }));
    } catch (error) {
      dispatch(setError("Failed to upload image. Try again."));
    } finally {
      setIsUploading(false);
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

  const handleEdit = (categoryToEdit) => {
    setEditCategory(categoryToEdit);
    setFormData(categoryToEdit);

    console.log("Updated productToEdit:", categoryToEdit);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    if (name === "selectedCategory") {
      setFilteredSubcategories(
        subcategories.filter(
          (subcategory) => subcategory.category_id === parseInt(value)
        )
      );
      setProduct((prev) => ({ ...prev, subcategory_id: "" }));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
    });
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      !filters.search || category.name.toString().includes(filters.search);

    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
      <h2 className="page-title">Categories Management</h2>
      {error && <div className="error-message">Error: {error}</div>}
      {message && <div className="success-message">{message}</div>}
      {editCategory ? (
        <EditProductForm
          category={formData}
          imagePreview={imagePreview}
          isUploading={isUploading}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleUpdate={handleUpdate}
          setEditCategory={setEditCategory}
        />
      ) : (
        <div className="SDB_product-list">
          <div className="filters">
            <input
              type="text"
              name="search"
              placeholder="Search By Category Name"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <button
              className="clear-filters-button"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>

          <div className="SDB_product-grid">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : categories.length > 0 ? (
              filteredCategories.map((cat) => (
                <div key={cat.id} className="SDB_product-card">
                  <img
                    src={
                      cat.category_image || "https://via.placeholder.com/150"
                    }
                    alt={cat.name}
                    className="SDB_product-image"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/150")
                    }
                  />
                  <div className="SDB_product-info">
                    <h3 className="SDB_product-title">{cat.name}</h3>
                    <p className="SDB_product-description">
                      {cat.description || "No Description"}
                    </p>

                    <div className="product-actions">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className="statistics-button"
                      >
                        Statistics
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products-message">No Categories found.</p>
            )}
          </div>
          {paginationControls}
        </div>
      )}
      {selectedCategory && (
        <div className="order-details-modal-wrapper">
          <div className="order-details-modal">
            <button
              className="close-button"
              onClick={() => setSelectedCategory(null)}
            >
              ×
            </button>
            <h3>{selectedCategory.name}</h3>
            <div className="content">
              <div className="SDB_product-info">
                <p className="SDB_product-times_ordered">
                  {selectedProduct.total_orders_containing_product > 0
                    ? selectedProduct.total_orders_containing_product
                    : "Not Ordered Yet"}
                </p>
              </div>
            </div>

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

export default AdminManageCatigories;
