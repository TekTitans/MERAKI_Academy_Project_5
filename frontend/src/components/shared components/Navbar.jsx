import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"
const Navbar=()=>{
    const navigate=useNavigate()

    return(
        <div className="navbox">
            <h4>SmartCart</h4>
            <Link >login</Link>

        </div>
    )
}
export default Navbar