import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ isOpen, autoClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        autoClose(); // Automatically close the toast
      }, 3000); // Display the toast for 3 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [isOpen, autoClose]);

  if (!isOpen) return null; // Do not render the toast if not visible

  return (
    <div className="toast">
      <span>{message}</span>
    </div>
  );
};

export default Toast;
