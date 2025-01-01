import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setMessage } from "../redux/reducers/orders";
import "./style.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import EditCategoryForm from "../AdminEditCategory";
import AddCategories from "../AddCategory";

const AdminManageCatigories = () => {
  const [editCategory, setEditCategory] = useState(null);
  const [isCategory, setIsCategory] = useState(true);
  const [addCat, setAddCat] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_image: "",
    subcategory_image: "",
    category_id: "",
    isCategory: isCategory,
  });

  const dispatch = useDispatch();
  const [mainCat, setMainCat] = useState("");
  const { loading, error, message } = useSelector((state) => state.order);
  const [imagePreview, setImagePreview] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [chosenId, setChosenId] = useState(0);

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
      console.log("ccc", response.data);
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

  useEffect(() => {
    fetchSubcategories(currentPage, chosenId);
  }, [deleted, updated]);

  const handleDelete = async (catId) => {
    try {
      console.log("catId: ", catId);

      const endpoint = isCategory
        ? `http://localhost:5000/category/${catId}`
        : `http://localhost:5000/subcategory/${catId}`;

      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setLoading(false));
      dispatch(setMessage("Category deleted successfully!"));
      fetchCategories(currentPage);
      setDeleted(!deleted);
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Failed to delete category."));
    }
  };

  const validateForm = () => {
    if (!formData.category_name || !formData.category_description) {
      dispatch(setLoading(false));
      dispatch(setError("name and description are required."));
      return false;
    }
    return true;
  };
  const handleEdit = (categoryToEdit) => {
    setEditCategory({
      ...categoryToEdit,
      isCategory: isCategory,
    });
    setFormData({
      ...categoryToEdit,
      isCategory: isCategory,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
    setEditCategory({ ...editCategory, [name]: value });
    console.log(editCategory);
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
      const {
        name,
        description,
        category_image,
        subcategory_image,
        category_id,
        isCategory,
      } = formData;
      console.log("isCategory: ", isCategory);
      console.log("editCategory.id: ", editCategory.id);

      const endpoint = isCategory
        ? `http://localhost:5000/category/${editCategory.id}`
        : `http://localhost:5000/subcategory/${editCategory.id}`;
      const data = isCategory
        ? { name, description, category_image }
        : {
            name,
            description,
            subcategory_image,
          };

      const response = await axios.put(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(
        setMessage(
          isCategory
            ? "Category updated successfully!"
            : "SubCategory updated successfully!"
        )
      );
      setFormData({
        name: "",
        description: "",
        category_image: "",
        subcategory_image: "",
        category_id: "",
        isCategory: true,
      });

      setImagePreview("");
      dispatch(setLoading(false));
      setUpdated(!updated);
      setImagePreview("");
    } catch (error) {
      setError(
        isCategory
          ? "Failed to add Category. Please try again."
          : "Failed to add SubCategory. Please try again."
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

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
      !filters.search ||
      category.name
        .toString()
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    return matchesSearch;
  });

  const filteredSubCategories = subcategories.filter((category) => {
    const matchesSearch =
      !filters.search ||
      category.name
        .toString()
        .toLowerCase()
        .includes(filters.search.toLowerCase());

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

  const handleShowSub = (catId, catName) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    fetchSubcategories(1, catId);
    setMainCat(catName);
    setIsCategory(false);
    setChosenId(catId);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setEditCategory(null);
    setSubcategories([]);
    setCurrentPage(currentPage);
    setImagePreview("");
    setIsCategory(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleBackToSubCategories = () => {
    setEditCategory(null);
    setCurrentPage(currentPage);
    setImagePreview("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      const timer = setTimeout(() => {
        dispatch(setError(null));
        dispatch(setMessage(null));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="cat-page">
      {error && <div className="error-message">Error: {error}</div>}
      {message && <div className="success-message">{message}</div>}

      <>
        <h2 className="page-title">Categories Management</h2>

        {editCategory ? (
          <>
            <EditCategoryForm
              editCategory={editCategory}
              formData={formData}
              imagePreview={imagePreview}
              isUploading={isUploading}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              handleUpdate={handleUpdate}
              setEditCategory={setEditCategory}
              handleBackToCategories={handleBackToCategories}
              categories={categories}
              setFormData={setFormData}
              handleBackToSubCategories={handleBackToSubCategories}
              isCategory={isCategory}
            />
          </>
        ) : (
          <>
            {selectedCategory ? (
              filteredSubCategories.length ? (
                <div className="SDB_product-list">
                  <h3>{mainCat}</h3>
                  <div className="Cat_Header">
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
                      <button
                        className="edit_back-button"
                        onClick={handleBackToCategories}
                      >
                        Back
                      </button>{" "}
                    </div>

                    <button
                      onClick={() => {
                        setAddCat(true);
                      }}
                      className="edit-button"
                    >
                      {addCat ? "Add New" : "Back"}
                    </button>
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
                              {cat.category_description || "No Description"}
                            </p>

                            <div className="product-actions">
                              <button
                                onClick={() => {
                                  handleEdit(cat);
                                }}
                                className="edit-button"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(cat.id);
                                }}
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
                <>
                  {" "}
                  <div className="Cat_Header">
                    <h3>{mainCat}</h3>

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
                      <button
                        className="edit_back-button"
                        onClick={handleBackToCategories}
                      >
                        Back
                      </button>{" "}
                    </div>
                  </div>
                  <p className="no-products-message">No SubCategories</p>{" "}
                </>
              )
            ) : (
              <div className="SDB_product-list">
                <div className="Cat_Header">
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
                          alt={cat.category_name}
                          className="SDB_product-image"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                        <div className="SDB_product-info">
                          <h3 className="SDB_product-title">
                            {cat.category_name}
                          </h3>
                          <p className="SDB_product-description">
                            {cat.category_description || "No Description"}
                          </p>

                          <div className="product-actions">
                            <button
                              onClick={() => {
                                handleEdit(cat);
                              }}
                              className="edit-button"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleShowSub(cat.id, cat.name)}
                              className="statistics-button"
                            >
                              SubCategories
                            </button>

                            <button
                              onClick={() => {
                                handleDelete(cat.id);
                              }}
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
      </>
    </div>
  );
};

export default AdminManageCatigories;
