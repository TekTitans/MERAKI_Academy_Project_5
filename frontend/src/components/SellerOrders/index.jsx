import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, setLoading, setError } from "../redux/reducers/orders";
import axios from "axios";
import "./style.css";

const SellerOrders = () => {
  const dispatch = useDispatch();
  const sellerId = useSelector((state) => state.auth.userId);
  const { token } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.order);

  const [filters, setFilters] = useState({
    dateRange: { from: "", to: "" },
    status: "",
    paymentStatus: "",
    priceRange: { min: "", max: "" },
    search: "",
  });

  const [selectedOrder, setSelectedOrder] = useState(null); 

  const fetchSellerOrders = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `http://localhost:5000/order/seller/${sellerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setOrders(response.data.result));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchSellerOrders();
    }
  }, [sellerId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesDate =
      !filters.dateRange.to ||
      new Date(order.created_at) <= new Date(filters.dateRange.to);

    const matchesStatus =
      !filters.status || order.order_status === filters.status;

    const matchesPaymentStatus =
      !filters.paymentStatus || order.payment_status === filters.paymentStatus;

    const matchesPrice =
      (!filters.priceRange.min ||
        order.total_price >= parseFloat(filters.priceRange.min)) &&
      (!filters.priceRange.max ||
        order.total_price <= parseFloat(filters.priceRange.max));

    const matchesSearch =
      !filters.search ||
      order.order_id.toString().includes(filters.search) ||
      order.user_id.toString().includes(filters.search);

    return (
      matchesDate &&
      matchesStatus &&
      matchesPaymentStatus &&
      matchesPrice &&
      matchesSearch
    );
  });

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to update the order status to "${newStatus}"?`
      )
    ) {
      axios
        .put(
          `http://localhost:5000/order/${orderId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => fetchSellerOrders())
        .catch((error) => console.error(error));
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="seller-page">
      <h2 className="page-title">Seller Orders</h2>

      <div className="filters">
        <input
          type="date"
          name="dateRange.to"
          placeholder="To Date"
          value={filters.dateRange.to}
          onChange={handleFilterChange}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Order Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
        <select
          name="paymentStatus"
          value={filters.paymentStatus}
          onChange={handleFilterChange}
        >
          <option value="">Payment Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <input
          type="number"
          name="priceRange.min"
          placeholder="Min Price"
          value={filters.priceRange.min}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="priceRange.max"
          placeholder="Max Price"
          value={filters.priceRange.max}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="search"
          placeholder="Search Orders"
          value={filters.search}
          onChange={handleFilterChange}
        />
      </div>

      {/* Orders Table */}
      <div className="seller-orders">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total Price</th>
              <th>Order Status</th>
              <th>Payment Status</th>
              <th>Shipping Address</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.user_id}</td>
                  <td>
                    {order.total_price
                      ? Number(order.total_price).toFixed(2)
                      : "0.00"}
                  </td>
                  <td className={`status ${order.order_status.toLowerCase()}`}>
                    {order.order_status}
                  </td>
                  <td
                    className={`status ${order.payment_status.toLowerCase()}`}
                  >
                    {order.payment_status}
                  </td>
                  <td>{order.shipping_address}</td>
                  <td>
                    {new Date(order.created_at).toLocaleDateString()}{" "}
                    {new Date(order.created_at).toLocaleTimeString()}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleOrderStatusUpdate(order.order_id, "Shipped")
                      }
                    >
                      Mark as Shipped
                    </button>
                    <button
                      onClick={() =>
                        handleOrderStatusUpdate(order.order_id, "Canceled")
                      }
                    >
                      Cancel Order
                    </button>
                    <button onClick={() => setSelectedOrder(order)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-details-modal">
          <h3>Order Details</h3>
          <p>Order ID: {selectedOrder.order_id}</p>
          <p>User ID: {selectedOrder.user_id}</p>
          <p>Total Price: ${Number(selectedOrder.total_price).toFixed(2)}</p>
          <p>Order Status: {selectedOrder.order_status}</p>
          <p>Payment Status: {selectedOrder.payment_status}</p>
          <p>Shipping Address: {selectedOrder.shipping_address}</p>
          <p>
            Created At: {new Date(selectedOrder.created_at).toLocaleString()}
          </p>
          <button onClick={() => setSelectedOrder(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
