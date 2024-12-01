import React, { useEffect } from "react";
import "./Modal.css";

const Modal = ({ isOpen, autoClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        autoClose();
      }, 3000); // Automatically close after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [isOpen, autoClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container error">
        <div className="modal-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/753/753345.png"
            alt="Error"
            className="modal-icon"
          />
        </div>
        <div className="modal-content">
          <p className="modal-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
