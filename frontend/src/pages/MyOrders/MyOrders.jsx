import axios from "axios";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const MyOrders=()=>{
    const [myOrders,setMyOrders]=useState([])
    const token = useSelector((state) => state.auth.token);
    const headers = {
        Authorization: `Bearer ${token}`,
      };
useEffect(() => {
    axios
      .get("http://localhost:5000/order/user/orders", { headers })
      .then((response) => {
        setMyOrders(response.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(myOrders)

    return <div>
        myorders
    </div>
}
export default MyOrders;
