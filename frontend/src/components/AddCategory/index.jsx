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
    subCategory_image: "",
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
        const response = await axios.get("http://localhost:5000/category");
        setCategories(response.data.category);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formDataToUpload = new FormData();
    formDataToUpload.append("category_image", file);
    formDataToUpload.append("subcategory_image", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/category/upload_Image",
        formDataToUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImagePreview(URL.createObjectURL(file));
      setFormData((prevState) => ({
        ...prevState,
        category_image: res.data.url,
        subCategory_image: res.data.url,
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
      title,
      description,
      category_image,
      subCategory_image,
      category_id,
      isCategory,
    } = formData;

    if (!title || !description) {
      dispatch(setError("Please fill all required fields."));
      return;
    }

    dispatch(setLoading(true));
    try {
      console.log("isCategory: ", isCategory);
      const endpoint = isCategory;
      console.log("endpoint: ", endpoint);
      console.log("title: ", title);
      console.log("description: ", description);
      console.log("category_image: ", category_image);
      console.log("subCategory_image: ", subCategory_image);
      console.log("category_id: ", parseInt(category_id, 10))
        ? "http://localhost:5000/category"
        : "http://localhost:5000/subcateogry";
      const data = isCategory
        ? { title, description, category_image }
        : {
            title,
            description,
            category_id: parseInt(category_id, 10),
            subCategory_image,
          };

      const response = await axios.post(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("response: ", response);

      dispatch(
        setMessage(
          isCategory
            ? "Category added successfully!"
            : "SubCategory added successfully!"
        )
      );
      setFormData({
        title: "",
        description: "",
        category_image: "",
        subCategory_image: "",
        category_id: "",
        isCategory: true,
      });

      setImagePreview("");
    } catch (error) {
      dispatch(
        setError(
          isCategory
            ? "Failed to add Category. Please try again."
            : "Failed to add SubCategory. Please try again."
        )
      );
      console.log("error: ", error);
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
      <h2 className="page-title">
        {formData.isCategory ? "Add New Category" : "Add New SubCategory"}
      </h2>
      <div className="add-product-container">
        {error && <div className="error-message">Error: {error}</div>}
        {message && <div className="success-message">{message}</div>}

        <button
          onClick={() =>
            setFormData({ ...formData, isCategory: !formData.isCategory })
          }
        >
          {formData.isCategory ? "Switch to SubCategory" : "Switch to Category"}
        </button>

        <form onSubmit={handleSubmit} className="product-form">
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
              name="title"
              value={formData.title}
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

            <button
              type="submit"
              className="submit-button"
              disabled={loading || isUploading}
            >
              {loading
                ? "Saving..."
                : formData.isCategory
                ? "Add Category"
                : "Add SubCategory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategories;
