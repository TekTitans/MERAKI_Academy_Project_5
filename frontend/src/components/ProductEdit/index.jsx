import React, { useEffect } from "react";
import { FaImage } from "react-icons/fa";
import { RingLoader } from "react-spinners";
import "./style.css";
import { setError, setMessage } from "../redux/reducers/orders";
import { useDispatch, useSelector } from "react-redux";

const EditProductForm = ({
  product,
  imagePreview,
  isUploading,
  handleChange,
  handleFileChange,
  handleUpdate,
  setEditProduct,
  setIseditProduct,
}) => {
  const { loading, error, message } = useSelector((state) => state.order);
  const dispatch = useDispatch();

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
  );
};

export default EditProductForm;
