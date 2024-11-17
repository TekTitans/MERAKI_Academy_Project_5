import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { filterdProduct, setProducts } from "../redux/reducers/product/product";
const Category = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const products = useSelector((state) => {
    return state.product.products;
  });

  //   const handleFilter = (id) => {
  //     console.log(products);
  //     dispatch(filterdProduct(id));
  //     setProducts(filterdProduct);
  //   };

  const handleFilter = (id) => {
    axios
      .get(`http://localhost:5000/products/category/${id}`)
      .then((response) => {
        setProducts(response.data.product);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    axios
      .get(` http://localhost:5000/category`)
      .then((result) => {
        console.log(result.data.category);

        setCategories(result.data.category);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const allcategories = categories?.map((elem, index) => {
    return (
      <div className="categoryCard" key={index}>
        <button
          onClick={() => {
            handleFilter(elem.id);
          }}
        >
          {elem.name}
        </button>
      </div>
    );
  });
  console.log(products);

  return <div className="categories">{allcategories}</div>;
};

export default Category;
