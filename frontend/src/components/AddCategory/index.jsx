import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaImage } from "react-icons/fa";
import { RingLoader } from "react-spinners";
import "./style.css";
import { setLoading, setError, setMessage } from "../redux/reducers/orders";

const AddCategories = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_image: "",
    subcategory_image: "",
    category_id: "",
    isCategory: true,
  });

  const { loading, error, message } = useSelector((state) => state.order);
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://smartcart-xdki.onrender.com/category");
        setCategories(response.data.category);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [categories]);

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
        ? "https://smartcart-xdki.onrender.com/category/upload_Image"
        : `https://smartcart-xdki.onrender.com/subcategory/upload_Image`;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      description,
      category_image,
      subcategory_image,
      category_id,
      isCategory,
    } = formData;

    if (!name || !description) {
      dispatch(setError("Please fill all required fields."));
      return;
    }

    if (!isCategory && !category_id) {
      dispatch(setError("Please select a category for the subcategory."));
      return;
    }

    dispatch(setLoading(true));
    try {
      const endpoint = isCategory
        ? "https://smartcart-xdki.onrender.com/category"
        : `https://smartcart-xdki.onrender.com/subcategory/${category_id}`;
      console.log("category_id", category_id);
      const data = isCategory
        ? { name, description, category_image }
        : {
            name,
            description,
            subcategory_image,
          };

      console.log("Endpoint:", endpoint);
      console.log("Data sent to API:", data);

      const response = await axios.post(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(
        setMessage(
          isCategory
            ? "Category added successfully!"
            : "SubCategory added successfully!"
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
    } catch (error) {
      console.error("Error:", error);
      dispatch(
        setError(
          isCategory
            ? "Failed to add Category. Please try again."
            : "Failed to add SubCategory. Please try again."
        )
      );
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
      
      <h2 className="addCat_page-title">
        {formData.isCategory ? "Add New Category" : "Add New SubCategory"}
      </h2>
      <div className="add-product-container">
        {error && <div className="error-message">Error: {error}</div>}
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleSubmit} className="category-form">
          <div className="product__image-container">
            <div className="image-upload">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Category Preview"
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Title"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />

            {!formData.isCategory && (
              <select
                name="category_id"
                value={formData.category_id}
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
            )}
            <div className="addCat_Btn">
              <button
                type="submit"
                className="addCat_submit-button"
                disabled={loading || isUploading}
              >
                {loading
                  ? "Saving..."
                  : formData.isCategory
                  ? "Add Category"
                  : "Add SubCategory"}
              </button>
              <button
                className="switchCat_submit-button"
                onClick={() =>
                  setFormData({ ...formData, isCategory: !formData.isCategory })
                }
              >
                {formData.isCategory
                  ? "Switch to SubCategory"
                  : "Switch to Category"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategories;
