import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./style.css"; // Import the modern styles with icons

const Breadcrumb = () => {
  const location = useLocation();
  const { cId, pId } = useParams(); // Fetch cId and pId from URL params
  const [categoryName, setCategoryName] = useState(null);
  const [productName, setProductName] = useState(null);

  useEffect(() => {
    if (cId) {
      fetch(`http://localhost:5000/category/${cId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setCategoryName(data.category.name);
          }
        })
        .catch((error) => console.error("Error fetching category:", error));
    }

    if (pId) {
      fetch(`http://localhost:5000/products/${pId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setProductName(data.product.title);
          }
        })
        .catch((error) => console.error("Error fetching product:", error));
    }
    [cId, pId];
  });

  const labels = {
    "": "Home",
    shop: "Shop",
    category: categoryName || "Category",
    product: productName || "Product",
  };

  const getLabel = (path) => {
    if (path === "category") {
      return categoryName || labels.category;
    }
    if (path === "product") {
      return productName || labels.product;
    }
    return labels[path] || path;
  };

  const paths = location.pathname.split("/").filter((path) => path);

  return (
    <nav id="breadcrumb">
      <ul>
        <li>
          <Link to="/">
            <i className="fas fa-home"></i> Home
          </Link>
        </li>
        <li>
          <Link to="/shop">
            <i className="fas fa-store"></i> Shop
          </Link>
        </li>
        {cId && categoryName && (
          <>
            <Link id="breadcrumb_cat" to={`/shop/${cId}`}>
              <i className="fas fa-th"></i> {categoryName}
            </Link>
          </>
        )}
        {pId && productName && (
          <>
            <span>
              <i className="fas fa-box"></i> {productName}
            </span>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
