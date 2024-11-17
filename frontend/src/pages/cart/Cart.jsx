import React,{useState,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import axios from "axios";
//import "./Cart.css"
const Cart=()=>{
    const [numOfItems,setNumOfitems]=useState(0)
    const cart = useSelector((state) => {

        return state.product.cart;
      });
useEffect(()=>{
    
},[])



    const renderCart=cart.map((elem,index)=>{
    
        return(
            <div key={index}>
                <p>{numOfItems}</p>
                {elem.title}
                </div>
        )
    })
    console.log(cart)
    return(
        <h1>{renderCart}</h1>
    )
    
}
export default Cart