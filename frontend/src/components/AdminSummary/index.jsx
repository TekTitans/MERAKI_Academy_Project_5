import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage, setLoading, setError } from "../redux/reducers/orders";
import axios from "axios";
import "./style.css";

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
    blockedUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    orderConversionRate: 0,
    averageOrderValue: 0,
    lowStockProducts: [],
    mostReviewedProducts: [],
    revenueByCategory: [],
    geographicDistribution: [],
  });

  const fetchAdminSummary = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await axios.get(
        "https://smartcart-xdki.onrender.com/order/admin/summary",
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
          ...adminSummary,
          ...summary,
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

  const renderStars = (rating) => {
    const maxStars = 5;
    return (
      <span className="rating-stars">
        {Array.from({ length: maxStars }, (_, i) =>
          i < rating ? "★" : "☆"
        ).join("")}
      </span>
    );
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
    <div className="seller-page">
      <h2 className="page-title">Admin Summary</h2>

      {error && <div className="error-message">Error: {error}</div>}
      {message && <div className="success-message">{message}</div>}

      <div className="seller-summary">
        <div className="summary-cards">
          <div className="summary-card total-users">
            <h4>Total Users</h4>
            <p>{adminSummary.totalUsers}</p>
          </div>
          <div className="summary-card blocked-users">
            <h4>Blocked Users</h4>
            <p>{adminSummary.blockedUsers}</p>
          </div>
          <div className="summary-card new-users">
            <h4>New Users</h4>
            <p>{adminSummary.newUsers}</p>
          </div>
          <div className="summary-card total-products">
            <h4>Total Products</h4>
            <p>{adminSummary.totalProducts}</p>
          </div>
          <div className="summary-card best-product">
            <h4>Best Product</h4>
            <p>
              {adminSummary.bestProduct?.name}
              <br />
              Avg. Rating: {adminSummary.bestProduct?.averageRating}
              <br />
              {renderStars(adminSummary.bestProduct?.averageRating)}
            </p>
          </div>
          <div className="summary-card best-seller">
            <h4>Best Seller</h4>
            <p>
              {adminSummary.bestSeller?.name}
              <br />
              {adminSummary.bestSeller?.averageRating}
              <br />
              {renderStars(adminSummary.bestSeller?.averageRating)}
            </p>
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
          <div className="summary-card conversion-rate">
            <h4>Order Conversion Rate</h4>
            <p>{adminSummary.orderConversionRate}%</p>
          </div>
          <div className="summary-card average-order-value">
            <h4>Average Order Value</h4>
            <p>{adminSummary.averageOrderValue}</p>
          </div>

          <div className="summary-card total-revenue">
            <h4>Total Revenue</h4>
            <p>{adminSummary.totalRevenue}</p>
          </div>
          {adminSummary.revenueByCategory.length > 0 && (
            <div className="summary-card revenue-by-category">
              <h4>Revenue by Category</h4>
              <ul>
                {adminSummary.revenueByCategory.map((category) => (
                  <li key={category.id}>
                    {category.category}: {category.revenue}
                  </li>
                ))}
              </ul>
            </div>
          )}
 {adminSummary.lowStockProducts.length > 0 && (
            <div className="summary-card low-stock-products">
              <h4>Low Stock Products</h4>
              <ul>
                {adminSummary.lowStockProducts.map((product) => (
                  <li key={product.id}>
                    {product.name} (Stock: {product.stock})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {adminSummary.mostReviewedProducts.length > 0 && (
            <div className="summary-card most-reviewed-products">
              <h4>Most Reviewed Products</h4>
              <ul>
                {adminSummary.mostReviewedProducts.map((product) => (
                  <li key={product.id}>
                    {product.name} ({product.reviews} reviews)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
