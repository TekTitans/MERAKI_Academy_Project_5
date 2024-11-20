import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { setProducts } from "../redux/reducers/product/product";
const Category = () => {
  const { id } = useParams();
  // const Navigate = useNavigate();

  const dispatch = useDispatch();
  // const [categories, setCategories] = useState([]);
  const products = useSelector((state) => {
    return state.product.products;
  });
  const handleFilter = (id) => {
    axios
      .get(`http://localhost:5000/products/category/${id}`)
      .then((response) => {

        dispatch(setProducts(response.data.products));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleFilter(id);
  }, []);

  const showAllProducts = products?.map((product, index) => {
    return (
      <div key={index} className="product-card">
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">{product.price} JD</div>
          <Link to={`/details/${product.id}`}>Details</Link>
        </div>
      </div>
    );
  });

  return <div className="container">{showAllProducts}</div>;
};

export default Category;
