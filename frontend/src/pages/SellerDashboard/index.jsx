import React, { useState } from "react";
import SellerProducts from "../../components/SellerProducts";
import AddProduct from "../../components/AddProduct";
import "./style.css";

const SellerDashboard = () => {
  const [isaddProduct, setIsaddProduct] = useState(false);

  const handleCancelAdd = () => {
    setIsaddProduct(false);
    console.log("Cancelled adding product and navigated back.");
  };
  return (
    <div className="seller-dashboard-container">
      <h1>Seller Dashboard</h1>
      {isaddProduct ? (
        <div className="add-product-section">
          <button className="add_back-button" onClick={handleCancelAdd}>
            Back
          </button>
          <AddProduct handleCancelAdd={handleCancelAdd} />
        </div>
      ) : (
        <div className="seller-products-section">
          <button
            className="SDB_Add"
            onClick={() => {
              setIsaddProduct(true);
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
