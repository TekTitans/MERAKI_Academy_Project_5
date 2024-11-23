import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, setLoading, setError } from "../redux/reducers/orders";
import axios from "axios";
import "./style.css";

const SellerSummary = () => {
  const dispatch = useDispatch();
  const sellerId = useSelector((state) => state.auth.userId);
  const { token } = useSelector((state) => state.auth);
  const [sellerSummary, setSellerSummary] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    completedOrders: 0,
    confirmedOrders: 0,
    cancelledOrders: 0,
    totalSales: 0,
    totalProducts: 0,
    outOfStockProducts: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    topSellingProduct: 0,
  });

  const fetchSellerSummary = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await axios.get(
        "http://localhost:5000/order/seller/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const {
          totalOrders,
          pendingOrders,
          shippedOrders,
          completedOrders,
          confirmedOrders,
          cancelledOrders,
          totalSales,
          totalProducts,
          outOfStockProducts,
          totalCustomers,
          averageOrderValue,
          topSellingProduct,
        } = response.data.summary;

        console.log("Seller Summary:", {
          totalOrders,
          pendingOrders,
          shippedOrders,
          completedOrders,
          confirmedOrders,
          cancelledOrders,
          totalSales,
          totalProducts,
          outOfStockProducts,
          totalCustomers,
          averageOrderValue,
          topSellingProduct,
        });

        // Set the state with the received summary
        setSellerSummary({
          totalOrders,
          pendingOrders,
          shippedOrders,
          completedOrders,
          confirmedOrders,
          cancelledOrders,
          totalSales: parseFloat(totalSales).toFixed(2),
          totalProducts,
          outOfStockProducts,
          totalCustomers,
          averageOrderValue: parseFloat(averageOrderValue).toFixed(2),
          topSellingProduct,
        });
      }
    } catch (err) {
      console.error("Error fetching seller summary:", err);
      dispatch(
        setError("Failed to fetch seller summary. Please try again later.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchSellerSummary();
    }
  }, [sellerId]);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="seller-page">
      <h2 className="page-title">Seller Summary</h2>

      {error && <div className="error-message">Error: {error}</div>}

      {loading && <div className="loading-spinner">Loading...</div>}
      <div className="seller-summary">
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Total Orders</h4>
            <p>{sellerSummary.totalOrders}</p>
          </div>
          <div className="summary-card">
            <h4>Pending Orders</h4>
            <p>{sellerSummary.pendingOrders}</p>
          </div>
          <div className="summary-card">
            <h4>Confirmed Orders</h4>
            <p>{sellerSummary.confirmedOrders}</p>
          </div>
          <div className="summary-card">
            <h4>Cancelled Orders</h4>
            <p>{sellerSummary.cancelledOrders}</p>
          </div>
          <div className="summary-card">
            <h4>Shipped Orders</h4>
            <p>{sellerSummary.shippedOrders}</p>
          </div>
          <div className="summary-card">
            <h4>Completed Orders</h4>
            <p>{sellerSummary.completedOrders}</p>
          </div>
          <div className="summary-card">
            <h4>Total Sales</h4>
            <p>${parseFloat(sellerSummary.totalSales).toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h4>Total Products</h4>
            <p>{sellerSummary.totalProducts}</p>
          </div>
          <div className="summary-card">
            <h4>Out of Stock Products</h4>
            <p>{sellerSummary.outOfStockProducts}</p>
          </div>
          <div className="summary-card">
            <h4>Total Customers</h4>
            <p>{sellerSummary.totalCustomers}</p>
          </div>
          {sellerSummary.topSellingProduct && (
            <div className="summary-card">
              <h4>Top Selling Product</h4>
              <p>
                {sellerSummary.topSellingProduct.name} (
                {sellerSummary.topSellingProduct.unitsSold} units sold)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerSummary;
