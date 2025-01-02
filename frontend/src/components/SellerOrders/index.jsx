import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrders,
  setLoading,
  setError,
  setMessage,
} from "../redux/reducers/orders";
import axios from "axios";
import "./style.css";

const SellerOrders = () => {
  const dispatch = useDispatch();
  const sellerId = useSelector((state) => state.auth.userId);
  const { token } = useSelector((state) => state.auth);
  const { orders, loading, error, message } = useSelector(
    (state) => state.order
  );

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

  const [sellerSummary, setSellerSummary] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    confirmedOrders: 0,
    cancelledOrders: 0,
    totalSales: 0,
    totalProducts: 0,
    outOfStockProducts: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    topSellingProduct: 0,
  });

  const fetchSellerOrders = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await axios.get(
        `https://smartcart-xdki.onrender.com/order/seller/${sellerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setOrders(response.data.result));
      console.log("Orders", response);
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

  const handleClearFilters = () => {
    setFilters({
      selectedDate: "",
      status: "",
      paymentStatus: "",
      search: "",
    });
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
    setOrderToUpdate(order);
    setShowStatusModal(true);
  };

  const handleOrderStatusUpdate = async (order_id, newStatus) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      console.log("order_id", order_id);
      console.log("newStatus", newStatus);

      await axios.put(
        `https://smartcart-xdki.onrender.com/order/${order_id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setLoading(false));
      setShowStatusModal(false);
      fetchSellerOrders();
      dispatch(setMessage("Order Status Changed successfully"));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      return;
    }
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await axios.put(
        `https://smartcart-xdki.onrender.com/order/${orderToUpdate.order_id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setMessage("Order Status Changed successfully"));
      setShowStatusModal(false);
      fetchSellerOrders();
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  };

  const handleInvoice = (order_id) => {
    window.open(`https://smartcart-xdki.onrender.com/order/${order_id}/invoice`, "_blank");
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
    <>
      <div className="seller-page">
        <h2 className="page-title">Seller Orders</h2>

        {error && <div className="error-message">Error: {error}</div>}
        {message && <div className="success-message">{message}</div>}

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
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Canceled">Canceled</option>
          </select>

          <input
            type="text"
            name="search"
            placeholder="Search By Order/Customer Id"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <button className="clear-filters-button" onClick={handleClearFilters}>
            Clear
          </button>
        </div>

        <div className="seller-orders">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Total Price</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_id || "N/A"}</td>
                    <td>{order.user_id || "N/A"}</td>
                    <td>
                      {order.products
                        .reduce(
                          (total, product) =>
                            total + product.price * product.quantity,
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td className={`status ${order.order_status || "N/A"}`}>
                      {order.order_status || "N/A"}
                    </td>
                    <td>
                      {order.order_status === "Pending" && (
                        <>
                          <button
                            id="confirm_orders_Btn"
                            onClick={() =>
                              handleOrderStatusUpdate(
                                order.order_id,
                                "Confirmed"
                              )
                            }
                          >
                            Confirm
                          </button>
                          <button
                            id="cancel_orders_Btn"
                            onClick={() =>
                              handleOrderStatusUpdate(
                                order.order_id,
                                "Canceled"
                              )
                            }
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.order_status === "Confirmed" && (
                        <>
                          <button
                            id="ship_orders_Btn"
                            onClick={() =>
                              handleOrderStatusUpdate(order.order_id, "Shipped")
                            }
                          >
                            Ship
                          </button>
                          <button onClick={() => handleShowStatusModal(order)}>
                            Update Status
                          </button>
                          <button
                            id="invoice_Btn"
                            onClick={() => handleInvoice(order.order_id)}
                          >
                            Invoice
                          </button>
                        </>
                      )}

                      {order.order_status === "Shipped" && (
                        <>
                          <button onClick={() => handleShowStatusModal(order)}>
                            Update Status
                          </button>
                          <button
                            id="invoice_Btn"
                            onClick={() => handleInvoice(order.order_id)}
                          >
                            Invoice
                          </button>
                        </>
                      )}
                      {order.order_status === "Canceled" && (
                        <>
                          <button onClick={() => handleShowStatusModal(order)}>
                            Update Status
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showStatusModal && (
          <div className="order-status-modal-wrapper">
            <div className="status-modal-content">
              <button
                className="status-modal-close-button"
                onClick={() => setShowStatusModal(false)}
              >
                ×
              </button>
              <h3 className="status-modal-title">Change Order Status</h3>
              <p>
                <strong>Order ID:</strong> {orderToUpdate?.order_id}
              </p>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="status-modal-select"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Canceled">Canceled</option>
              </select>

              <div className="status-modal-footer">
                <button
                  onClick={handleUpdateStatus}
                  className="status-modal-update-button"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="status-modal-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedOrder && (
          <div className="order-details-modal-wrapper">
            <div className="order-details-modal">
              <button
                className="close-button"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
              <h3>Order Details</h3>
              <div className="content">
                <p>
                  <strong>Order ID:</strong> {selectedOrder.order_id}
                </p>
                <p>
                  <strong>User ID:</strong> {selectedOrder.user_id}
                </p>
                <p>
                  <strong>Total Price for Your Products:</strong> $
                  {Number(selectedOrder.seller_total_price).toFixed(2)}
                </p>
                <p>
                  <strong>Order Status:</strong> {selectedOrder.order_status}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {selectedOrder.payment_status}
                </p>
                <p>
                  <strong>Shipping Address:</strong>{" "}
                  {selectedOrder.shipping_address}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(selectedOrder.updated_at).toLocaleString()}
                </p>
                <h4>Products in Order:</h4>
                <ul className="product-list">
                  {selectedOrder.products.map((product) => (
                    <li key={product.product_id}>
                      <div>
                        <span>
                          <strong>Product Name:</strong> {product.product_name}
                        </span>
                        <span>
                          <strong>Quantity:</strong> {product.quantity}
                        </span>
                      </div>
                      <div>
                        <span>
                          <strong>Price:</strong> $
                          {Number(product.price).toFixed(2)}
                        </span>
                        <span>
                          <strong>Total:</strong> $
                          {Number(product.total).toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="Cancel"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerOrders;
