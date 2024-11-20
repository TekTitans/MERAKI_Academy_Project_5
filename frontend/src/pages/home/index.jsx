import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../components/redux/reducers/product/product";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
  const search = useSelector((state) => {
    return state.product.search;
  });
  const Navigate = useNavigate();
  const [filterProducts, setFilterProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [size, setSize] = useState(5);
  const products = useSelector((state) => {
    return state.product.products;
  });

  useEffect(() => {
    const filtered = products?.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilterProducts(filtered);
  }, [search, products]);


  return (
    <>
<h1>Home</h1>
    </>
  );
};
export default Home;
