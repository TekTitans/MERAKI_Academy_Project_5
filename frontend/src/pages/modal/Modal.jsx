import React from "react";
import "./Modal.css"; // Import the CSS file for modal styling

const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="pmessage">{message}</p>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
