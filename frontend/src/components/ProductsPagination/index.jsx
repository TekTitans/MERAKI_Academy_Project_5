import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { FaImage } from "react-icons/fa";
import { RingLoader } from "react-spinners";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const SellerProducts = ({
  message,
  setMessage,
  showMessage,
  iseditProduct,
  setIseditProduct,
}) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  const { token } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const paginationControls = (
    <div className="pagination-controls">
      <div
        className={`pagination-arrow ${
          currentPage === 1 || totalPages === 0 ? "disabled" : ""
        }`}
        onClick={() => currentPage > 1 && fetchProducts(currentPage - 1)}
        aria-disabled={currentPage === 1}
      >
        <FaArrowLeft size={20} />
      </div>
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      <div
        className={`pagination-arrow ${
          currentPage === totalPages || totalPages === 0 ? "disabled" : ""
        }`}
        onClick={() =>
          currentPage < totalPages && fetchProducts(currentPage + 1)
        }
        aria-disabled={currentPage === totalPages}
      >
        <FaArrowRight size={20} />
      </div>
    </div>
  );

  return <div className="seller-page">{paginationControls}</div>;
};

export default SellerProducts;
