import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  setcatid,
} from "../../components/redux/reducers/product/product";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
  const catId = useSelector((state) => {
    return state.product.catid;
  });

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
    axios
      .get(` http://localhost:5000/category`)
      .then((result) => {
        setCategories(result.data.category);
        //setcatid(result.data.category.id);
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
            Navigate(`/category/${elem.id}`);
          }}
        >
          {elem.name}
        </button>
      </div>
    );
  });
  const getAllProducts = async () => {
    try {
      const result = await axios.get(
        `http://localhost:5000/products?size=${size}`
      );

      if (result.data.success) {
        const allProducts = result.data.result;

        dispatch(setProducts(allProducts));
        setFilterProducts(allProducts);
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
    if (size > products.length) {
      setSize(size - 5);
    }
  };
  useEffect(() => {
    getAllProducts();
  }, [products]);

  // useEffect(() => {
  //   const catFilter = products.filter((product) => {
  //     product.category_id === 1;
  //   });
  //   console.log(catFilter);
  // }, []);
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilterProducts(filtered);
  }, [search, products]);

  const showAllProducts = filterProducts?.map((product, index) => {
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
  return (
    <>
      <div className="categories">{allcategories}</div>

      <div className="container">{showAllProducts}</div>
      <button className="pagination" onClick={handleSize}>
        Show More
      </button>
    </>
  );
};
export default Home;
