import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./style.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-controls">
      <div
        className={`pagination-arrow ${
          currentPage === 1 || totalPages === 0 ? "disabled" : ""
        }`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
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
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        aria-disabled={currentPage === totalPages}
      >
        <FaArrowRight size={20} />
      </div>
    </div>
  );
};

export default Pagination;
