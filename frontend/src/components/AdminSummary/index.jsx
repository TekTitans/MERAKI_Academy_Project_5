import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage, setLoading, setError } from "../redux/reducers/orders";
import axios from "axios";
import "./style.css";

const RatingStars = ({ rating }) => {
  const maxStars = 5;
  return (
    <span className="rating-stars">
      {Array.from({ length: maxStars }, (_, i) =>
        i < rating ? "★" : "☆"
      ).join("")}
    </span>
  );
};

const AdminSummary = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { loading, error, message } = useSelector((state) => state.order);

  const [adminSummary, setAdminSummary] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalReviews: 0,
    topSellingProduct: null,
    bestProduct: null,
    bestSeller: null,
  });

  const fetchAdminSummary = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await axios.get(
        "http://localhost:5000/order/admin/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const summary = response.data.summary;
        console.log(response.data);

        setAdminSummary({
          totalUsers: summary.totalUsers,
          totalProducts: summary.totalProducts,
          totalOrders: summary.totalOrders,
          pendingOrders: summary.pendingOrders,
          completedOrders: summary.completedOrders,
          totalRevenue: parseFloat(summary.totalRevenue).toFixed(2),
          totalReviews: summary.totalReviews || 0,
          topSellingProduct: summary.topSellingProduct || null,
          bestProduct: summary.bestProduct || null,
          bestSeller: summary.bestSeller || null,
        });
      }
    } catch (err) {
      console.error("Error fetching admin summary:", err);
      dispatch(
        setError("Failed to fetch admin summary. Please try again later.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAdminSummary();
  }, []);

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
      <h2 className="page-title">Admin Summary</h2>

      {error && <div className="error-message">Error: {error}</div>}
      {message && <div className="success-message">{message}</div>}

      <div className="seller-summary">
        <div className="summary-cards">
          <div className="summary-card total-products">
            <h4>Total Products</h4>
            <p>{adminSummary.totalProducts}</p>
          </div>

          <div className="summary-card total-users">
            <h4>Total Users</h4>
            <p>{adminSummary.totalUsers}</p>
          </div>

          {adminSummary.topSellingProduct && (
            <div className="summary-card top-selling-product">
              <h4>Top Selling Product</h4>
              <p>
                {adminSummary.topSellingProduct?.name} (
                {adminSummary.topSellingProduct?.unitsSold} units sold)
              </p>
            </div>
          )}

          <div className="summary-card total-reviews">
            <h4>Total Reviews</h4>
            <p>{adminSummary.totalReviews}</p>
          </div>

          <div className="summary-card best-product">
            <h4>Best Product</h4>
            {adminSummary.bestProduct ? (
              <>
                <p>{adminSummary.bestProduct.name}</p>
                <p>Avg. Rating: {adminSummary.bestProduct.averageRating}</p>
                <RatingStars rating={adminSummary.bestProduct.averageRating} />
              </>
            ) : (
              <p>No product data available</p>
            )}
          </div>

          <div className="summary-card best-seller">
            <h4>Best Seller</h4>
            {adminSummary.bestSeller ? (
              <>
                <p>{adminSummary.bestSeller.name}</p>
                <p>Avg. Rating: {adminSummary.bestSeller.averageRating}</p>
                <RatingStars rating={adminSummary.bestSeller.averageRating} />
              </>
            ) : (
              <p>No seller data available</p>
            )}
          </div>

          <div className="summary-card total-orders">
            <h4>Total Orders</h4>
            <p>{adminSummary.totalOrders}</p>
          </div>

          <div className="summary-card pending-orders">
            <h4>Pending Orders</h4>
            <p>{adminSummary.pendingOrders}</p>
          </div>

          <div className="summary-card completed-orders">
            <h4>Completed Orders</h4>
            <p>{adminSummary.completedOrders}</p>
          </div>

          <div className="summary-card total-sales">
            <h4>Total Revenue</h4>
            <p>${adminSummary.totalRevenue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
