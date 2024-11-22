import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, setLoading, setError } from "../redux/reducers/orders";
import axios from "axios";
import "./style.css";

const SellerOrders = () => {
  const dispatch = useDispatch();

  const sellerId = useSelector((state) => state.auth.userId);
  const { token } = useSelector((state) => state.auth);

  const { orders, loading, error } = useSelector((state) => state.order);

  const fetchSellerOrders = async (sellerId) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `http://localhost:5000/order/seller/${sellerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setOrders(response.data.result));
      dispatch(setLoading(false));
      console.log("order :", response.data.message);
      console.log("success :", response.data.success);
      console.log("order :", response.data.result);
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchSellerOrders(sellerId);
    }
  }, [sellerId]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div class="seller-orders">
      <h2>Seller's Orders</h2>
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Total Price</th>
            <th>Order Status</th>
            <th>Payment Status</th>
            <th>Shipping Address</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>101</td>
            <td>5</td>
            <td>$150.00</td>
            <td class="status pending">Pending</td>
            <td class="status completed">Completed</td>
            <td>123 Main St, City, Country</td>
            <td>12/10/2024 10:45 AM</td>
            <td>12/11/2024 01:30 PM</td>
          </tr>
          <tr>
            <td>102</td>
            <td>6</td>
            <td>$250.00</td>
            <td class="status shipped">Shipped</td>
            <td class="status failed">Failed</td>
            <td>456 Elm St, City, Country</td>
            <td>12/12/2024 02:10 PM</td>
            <td>12/13/2024 04:20 PM</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SellerOrders;
