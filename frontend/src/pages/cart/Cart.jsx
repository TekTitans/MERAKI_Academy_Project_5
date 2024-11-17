import React,{useState,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import axios from "axios";
const Cart=()=>{
    const [myCart,setMyCart]=useState({})
    const token = useSelector((state) => {
        return state.auth.token;
      });
    const  headers= {
        Authorization: `Bearer ${token}`,
      }
    const uId = useSelector((state) => {
        return state.auth.userId;
      });
    useEffect(() => {
        axios
          .get(`http://localhost:5000/cart`,{headers})
          .then((response) => {
            console.log(response.data.result);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);


    return(
        
        <h1>cart</h1>
    )
    
}
export default Cart