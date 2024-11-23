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
    selectedDate: "",
    status: "",
    paymentStatus: "",
    search: "",
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");

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
      !filters.selectedDate ||
      new Date(order.created_at) <= new Date(filters.selectedDate);

    const matchesStatus =
      !filters.status || order.order_status === filters.status;

    const matchesPaymentStatus =
      !filters.paymentStatus || order.payment_status === filters.paymentStatus;

    const matchesSearch =
      !filters.search ||
      order.order_id.toString().includes(filters.search) ||
      order.user_id.toString().includes(filters.search);

    return (
      matchesDate && matchesStatus && matchesPaymentStatus && matchesSearch
    );
  });

  const handleShowStatusModal = (order) => {
    console.log("handleShowStatusModal");
    console.log("showStatusModal before:", showStatusModal);

    setOrderToUpdate(order);
    setShowStatusModal(true);
    console.log("showStatusModal after:", showStatusModal);
  };

  const handleOrderStatusUpdate = (order_id, newStatus) => {
    console.log("newStatus:", newStatus);
    console.log("order_id:", order_id);

    axios
      .put(
        `http://localhost:5000/order/${order_id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        console.log("Order status updated successfully");
        setShowStatusModal(false); // Close the modal
        fetchSellerOrders(); // Refresh the orders list
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  const handleUpdateStatus = () => {
    if (!newStatus) {
      console.log("newStatus :", newStatus);
    }
    console.log("orderToUpdate :", orderToUpdate.order_id);

    axios
      .put(
        `http://localhost:5000/order/${orderToUpdate.order_id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setShowStatusModal(false);
        fetchSellerOrders(); 
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="seller-page">
      <h2 className="page-title">Seller Orders</h2>

      <div className="filters">
        <input
          type="date"
          name="selectedDate"
          placeholder="Before Date"
          value={filters.selectedDate}
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
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Canceled</option>
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
          type="text"
          name="search"
          placeholder="Search By Order/Customer Id"
          value={filters.search}
          onChange={handleFilterChange}
        />
      </div>

      <div className="seller-orders">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Id</th>
              <th>Customer Id</th>
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
                    {order.order_status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleOrderStatusUpdate(order.order_id, "confirmed")
                          }
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            handleOrderStatusUpdate(order.order_id, "cancelled")
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.order_status === "confirmed" && (
                      <>
                        <button onClick={() => handleShowStatusModal(order)}>
                          Change Status
                        </button>
                        <button
                          onClick={() =>
                            handleOrderStatusUpdate(order.order_id, "cancelled")
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.order_status === "completed" && (
                      <>
                        <button onClick={() => handleShowStatusModal(order)}>
                          Change Status
                        </button>
                      </>
                    )}
                    {order.order_status === "cancelled" && (
                      <>
                        <button onClick={() => handleShowStatusModal(order)}>
                          Change Status
                        </button>
                      </>
                    )}
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
      {showStatusModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Change Order Status</h3>
            <p>Order ID: {orderToUpdate?.order_id}</p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Canceled</option>
            </select>
            <div className="modal-actions">
              <button onClick={handleUpdateStatus}>Update</button>
              <div className="modal_cancel">
                <button onClick={() => setShowStatusModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
