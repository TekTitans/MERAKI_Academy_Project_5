import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";

const VerifyEmail = () => {
  const history = useNavigate();
  const [status, setStatus] = useState(null);
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      axios
        .post(`http://localhost:5000/users/verifyEmail/${token}`)
        .then((response) => {
          if (response.data.success) {
            setStatus({ message: response.data.message, success: true });
            setTimeout(() => {
              history("/users/login");
            }, 2000);
          }
        })
        .catch((error) => {
          setStatus({ message: error.response.data.message, success: false });
        });
    }
  }, [token, history]);

  return (
    <div className="verification-container">
      <h1 className="verification-title">Email Verification</h1>
      {status ? (
        <p
          className={`verification-message ${
            status.success ? "success" : "error"
          }`}
        >
          {status.message}
        </p>
      ) : (
        <p className="loading-text">Verifying...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
