import React, { useState } from "react";
import axios from "axios";

import { useParams, useNavigate } from "react-router-dom";
import "./style.css";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const history = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters, include a number, a letter, and a special character."
      );
      return;
    }

    setIsLoading(true);
    try {
      console.log({ resetToken, newPassword });

      const result = await axios.post(
        "http://localhost:5000/users/reset-password",
        { resetToken, newPassword }
      );

      if (result.data.success) {
        setMessage("Password updated successfully! Redirecting to login...");
        setStatus(true);
        setTimeout(() => {
          history("/users/login");
        }, 2000);
      } else {
        setMessage(result.data.message);
      }
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleBackToLogin = () => {
    history("/users/login");
  };
  return (
    <div className="ResetPassword_Container">
      <div className="ResetPassword_Form">
        <p className="Title">Reset Password:</p>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {passwordError && <div className="ErrorMessage">{passwordError}</div>}
        {message && (
          <div className={status ? "SuccessMessage" : "ErrorMessage"}>
            {message}
          </div>
        )}
        <div className="button-container_ResetPassword">
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : (
              "Confirm"
            )}
          </button>
          <a onClick={handleBackToLogin} className="forgot-password-link">
            Back to Login
          </a>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
