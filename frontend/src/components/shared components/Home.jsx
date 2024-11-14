import React,{useState,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css"
const Home=()=>{
    const[categories,setCategories]=useState([])
    useEffect(()=>{
        axios
        .get(` http://localhost:5000/category`)
        .then((result) => {
            setCategories(result.data.category)

        })
        .catch((err) => {
            console.log(err.message)
       
        });
    },[])
  const allcategories=categories?.map((elem,index)=>{
        return(<div className="categoryCard" key={index}>
            <h1>
                {elem.name}
            </h1>
        </div>)
    })
       // console.log(categories[2].name)


    return(
        <div className="categories"> 
            {allcategories}

        </div>
    )
}
export default Home