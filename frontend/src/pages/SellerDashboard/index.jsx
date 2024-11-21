import React, { useState } from "react";
import SellerProducts from "../../components/SellerProducts";
import AddProduct from "../../components/AddProduct";
import "./style.css";

const SellerDashboard = () => {
  const [addProduct, setAddProduct] = useState(false);
  return (
    <div className="seller-dashboard-container">
      <h1>Seller Dashboard</h1>
      {addProduct ? (
        <div className="add-product-section">
          <button
            className="add_back-button"
            onClick={() => {
              setAddProduct(false);
            }}
          >
            Back
          </button>
          <AddProduct />
        </div>
      ) : (
        <div className="seller-products-section">
          <button
            className="SDB_Add"
            onClick={() => {
              setAddProduct(true);
            }}
          >
            Add New Product
          </button>
          <SellerProducts />
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
