import React, { useEffect } from "react";
import "./Modal.css";

const Modal = ({ isOpen, autoClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        autoClose();
      }, 3000); 
      return () => clearTimeout(timer); 
    }
  }, [isOpen, autoClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-header">
        <img
          src="https://static.vecteezy.com/system/resources/previews/033/294/081/non_2x/yellow-exclamation-mark-icons-in-line-style-danger-alarm-caution-risk-business-concept-hazard-warning-attention-sign-with-exclamation-mark-symbol-vector.jpg" /* Replace with your icon URL */
          alt="Success"
          className="modal-icon"
        />
        <span className="modal-message">{message}</span>
      </div>
    </div>
  );
};

export default Modal;
