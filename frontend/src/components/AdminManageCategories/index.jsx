import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setMessage } from "../redux/reducers/orders";
import "./style.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import EditCategoryForm from "../AdminEditCategory";

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
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const fetchCategories = async (page = 1) => {
    try {
      dispatch(setLoading(true));

      if (!token) {
        dispatch(setLoading(false));
        dispatch(setError("No token found."));
        return;
      }
      const response = await axios.get(
        `http://localhost:5000/category?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotalPages(Math.ceil(response.data.totalCategories / pageSize));
      dispatch(setLoading(false));
      setCategories(response.data.category);
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Error fetching Categories"));
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (page = 1, catId) => {
    try {
      dispatch(setLoading(true));

      if (!token) {
        dispatch(setLoading(false));
        dispatch(setError("No token found."));
        return;
      }
      console.log("fetchSubcategories");

      console.log("catId: ", catId);
      const response = await axios.get(
        `http://localhost:5000/subcategory/${catId}?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("response: ", response.data);

      setTotalPages(Math.ceil(response.data.totalSubcategories / pageSize));
      setSubcategories(response.data.subCategory);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Error fetching subcategories"));
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [dispatch, token, currentPage, updated]);

  /*

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    dispatch(setLoading(true));
    try {
      const response = await axios.put(
        `http://localhost:5000/products/${product.product_id}`,
        formattedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditCategory(null);
      dispatch(setMessage("Product updated successfully!"));
      dispatch(setLoading(false));
      setUpdated(!updated);
      setImagePreview("");
    } catch (error) {
      dispatch(setError("Failed to update product."));
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  };


*/
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };
  const handleClearFilters = () => {
    setFilters({ search: "" });
    setCurrentPage(1);
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      !filters.search || category.name.toString().includes(filters.search);

    return matchesSearch;
  });

  const filteredSubCategories = subcategories.filter((category) => {
    const matchesSearch =
      !filters.search || category.name.toString().includes(filters.search);

    return matchesSearch;
  });

  const paginationControls = (
    <div className="pagination-controls">
      <div
        className={`pagination-arrow ${
          currentPage === 1 || totalPages === 0 ? "disabled" : ""
        }`}
        onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
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
          currentPage < totalPages && setCurrentPage((prev) => prev + 1)
        }
        aria-disabled={currentPage === totalPages}
      >
        <FaArrowRight size={20} />
      </div>
    </div>
  );

  const handleShowSub = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    fetchSubcategories(1, catId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setEditCategory(null);
    setSubcategories([]);
    setCurrentPage(1);
  };
  const handleBackToSubCategories = () => {
    setEditCategory(null);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(currentPage, selectedCategory);
    } else {
      fetchCategories(currentPage);
    }
  }, [currentPage, selectedCategory]);

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
        <>
          <button onClick={handleBackToCategories}>Back</button>{" "}
        </> /* <EditCategoryForm
  editCategory={editCategory}
  formData={formData}
  imagePreview={imagePreview}
  isUploading={isUploading}
  handleChange={handleChange}
  handleFileChange={handleFileChange}
  handleUpdate={handleUpdate}
  setEditCategory={setEditCategory}
/>*/
      ) : (
        <>
          {selectedCategory ? (
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
                <button onClick={handleBackToCategories}>Back</button>{" "}
              </div>

              <div className="SDB_product-grid">
                {loading ? (
                  <div className="loading-spinner">Loading...</div>
                ) : (
                  filteredSubCategories.map((cat) => (
                    <div key={cat.id} className="SDB_product-card">
                      <img
                        src={
                          cat.category_image ||
                          "https://via.placeholder.com/150"
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
                            onClick={
                              () => {
                                setEditCategory(true);
                              } /* handleEdit(cat)*/
                            }
                            className="edit-button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={
                              () => {
                                console.log("Delete");
                              }
                              /*handleDelete(cat.id)*/
                            }
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {paginationControls}
            </div>
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
                ) : (
                  filteredCategories.map((cat) => (
                    <div key={cat.id} className="SDB_product-card">
                      <img
                        src={
                          cat.category_image ||
                          "https://via.placeholder.com/150"
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
                            onClick={
                              () => {
                                setEditCategory(true);
                              } /*handleEdit(cat)*/
                            }
                            className="edit-button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleShowSub(cat.id)}
                            className="statistics-button"
                          >
                            SubCategories
                          </button>
                          <button
                            onClick={
                              () => {
                                console.log("Delete");
                              } /* handleDelete(cat.id)*/
                            }
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {paginationControls}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminManageCatigories;
