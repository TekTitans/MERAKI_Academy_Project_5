import React, { useContext, useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../components/redux/reducers/product/product";
import { Link } from "react-router-dom";
import { Search } from "../Serach";

export const Home = () => {
  const [isSerached, setIsSerached] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [size, setSize] = useState(5);
  const products = useSelector((state) => {
    return state.product.products;
  });

  const getAllProducts = async () => {
    try {
      const result = await axios.get(
        `http://localhost:5000/products?size=${size}`
      );

      if (result.data.success) {
        const allProducts = result.data.result;

        dispatch(setProducts(allProducts));
      } else {
        throw Error;
      }
    } catch (error) {
      if (!error.response.data.success) {
        return setMessage(error.response.data.message);
      }
      setMessage("Error happened while Get Data, please try again");
    }
  };
  const handleSize = () => {
    setSize(size + 5);
    console.log(size);
  };
  useEffect(() => {
    getAllProducts();
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
  //console.log(isSerached);

  return (
    <div className="container">
      {isSerached ? <Search /> : showAllProducts}
      <button className="pagination" onClick={handleSize}>
        Show More
      </button>
    </div>
  );
};
export default Home;
