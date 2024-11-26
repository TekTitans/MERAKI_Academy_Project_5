import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage, setLoading, setError } from "../redux/reducers/orders";
import axios from "axios";
import "./style.css";

const SellerSummary = () => {
  const dispatch = useDispatch();
  const sellerId = useSelector((state) => state.auth.userId);
  const { token } = useSelector((state) => state.auth);
  const { loading, error, message } = useSelector((state) => state.order);

  const [sellerSummary, setSellerSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
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
    topSellingProduct: null,
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
        const summary = response.data.summary;
        console.log(response.data);
        setSellerSummary({
          totalReviews: summary.totalReviews,
          averageRating: summary.averageRating,
          totalOrders: summary.totalOrders,
          pendingOrders: summary.pendingOrders,
          shippedOrders: summary.shippedOrders,
          completedOrders: summary.completedOrders,
          confirmedOrders: summary.confirmedOrders,
          cancelledOrders: summary.cancelledOrders,
          totalSales: parseFloat(summary.totalSales).toFixed(2),
          totalProducts: summary.totalProducts,
          outOfStockProducts: summary.outOfStockProducts,
          totalCustomers: summary.totalCustomers,
          topSellingProduct: summary.topSellingProduct || null,
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
      <h2 className="page-title">Seller Summary</h2>

      {error && <div className="error-message">Error: {error}</div>}
      {message && <div className="success-message">{message}</div>}

      <div className="seller-summary">
        <div className="summary-cards">
          <div className="summary-card total-products">
            <h4>Total Products</h4>
            <p>{sellerSummary.totalProducts}</p>
          </div>

          <div className="summary-card cancelled-orders">
            <h4>Out of Stock Products</h4>
            <p>{sellerSummary.outOfStockProducts}</p>
          </div>

          {sellerSummary.topSellingProduct && (
            <div className="summary-card top-selling-product">
              <h4>Top Selling Product</h4>
              <p>
                {sellerSummary.topSellingProduct?.name} (
                {sellerSummary.topSellingProduct?.unitsSold} units sold)
              </p>
            </div>
          )}
          <div className="summary-card total-customers">
            <h4>Total Customers</h4>
            <p>{sellerSummary.totalCustomers}</p>
          </div>
          <div className="summary-card total-reviews">
            <h4>Total Reviews</h4>
            <p>{sellerSummary.totalReviews || 0}</p>{" "}
          </div>

          <div className="summary-card average-rating">
            <h4>Average Rating</h4>
            <p>{(sellerSummary.averageRating || 0).toFixed(2)}</p>
          </div>
          <div className="summary-card total-orders">
            <h4>Total Orders</h4>
            <p>{sellerSummary.totalOrders}</p>
          </div>
          <div className="summary-card pending-orders">
            <h4>Pending Orders</h4>
            <p>{sellerSummary.pendingOrders}</p>
          </div>

          <div className="summary-card confirmed-orders">
            <h4>Confirmed Orders</h4>
            <p>{sellerSummary.confirmedOrders}</p>
          </div>

          <div className="summary-card cancelled-orders">
            <h4>Cancelled Orders</h4>
            <p>{sellerSummary.cancelledOrders}</p>
          </div>

          <div className="summary-card shipped-orders">
            <h4>Shipped Orders</h4>
            <p>{sellerSummary.shippedOrders}</p>
          </div>

          <div className="summary-card completed-orders">
            <h4>Completed Orders</h4>
            <p>{sellerSummary.completedOrders}</p>
          </div>

          <div className="summary-card total-sales">
            <h4>Total Sales</h4>
            <p>{sellerSummary.totalSales}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSummary;
