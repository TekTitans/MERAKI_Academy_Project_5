import axios from "axios";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import "./MyOrders.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const MyOrders = () => {
  const { error, message } = useSelector((state) => state.order);

  const [myOrders, setMyOrders] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/order/user/orders", { headers })
      .then((response) => {
        setMyOrders(response.data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [token]);

  const renderOrders = () => {
    if (myOrders.length === 0) {
      return (
        <div className="no-orders-message">
          <h2>You have no orders. Shop now!</h2>
        </div>
      );
    }

    let currentOrderId = null;
    let currentOrderTable = [];
    let totalAmountWithDelivery = 0;
    const tables = [];

    myOrders.forEach((order) => {
      if (order.order_id !== currentOrderId) {
        if (currentOrderTable.length > 0) {
          tables.push(
            <div className="order-table" key={currentOrderId}>
              <h2>Order ID: {currentOrderId}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrderTable.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={
                            item.product_image ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.title}
                          className="product-images"
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>{parseFloat(item.price).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {(item.quantity * parseFloat(item.price)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5">
                      <strong>
                        Total Price with Delivery:{" "}
                        {totalAmountWithDelivery.toFixed(2)}
                      </strong>
                      <br />
                      <strong>
                        Order Status: {currentOrderTable[0].order_status}
                      </strong>
                      <br />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }

        currentOrderTable = [];
        totalAmountWithDelivery = 0;
        currentOrderId = order.order_id;
      }

      currentOrderTable.push(order);
      totalAmountWithDelivery = parseFloat(order.total_amount_with_delivery);
    });

    if (currentOrderTable.length > 0) {
      tables.push(
        <div className="order-table" key={currentOrderId}>
          <h2>Order ID: {currentOrderId}</h2>
          <table>
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <tbody>
              {currentOrderTable.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={
                        item.product_image || "https://via.placeholder.com/150"
                      }
                      alt={item.title}
                      className="product-images"
                    />
                  </td>
                  <td>{item.title}</td>
                  <td>{parseFloat(item.price).toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>{(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5">
                  <strong>
                    Total Price with Delivery:{" "}
                    {totalAmountWithDelivery.toFixed(2)}
                  </strong>
                  <br />
                  <strong>
                    Order Status: {currentOrderTable[0].order_status}
                  </strong>
                  <br />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return tables;
  };

  return (
    <>
      <div>
        {loading ? (
          <div className="loading-container">
            <div className="loader">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <span>Loading...</span>
          </div>
        ) : (
          <>
            {error && <div className="error-message">Error: {error}</div>}
            {message && <div className="success-message">{message}</div>}
          </>
        )}
      </div>

      <div className="orders-container">
        <h1>My Orders</h1>
       { renderOrders()}
      </div>
    </>
  );
};

export default MyOrders;
