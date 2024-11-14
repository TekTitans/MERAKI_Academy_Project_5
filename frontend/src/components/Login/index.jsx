import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setUserId } from "../redux/reducers/auth";

const Login = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const history = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const login = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setMessage("");
    setIsLoading(true);

    if (!email) {
      setEmailError("Email is required");
      setIsLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      setIsLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters, include at least one number, one letter, and one special character"
      );
      setIsLoading(false);
      return;
    }

    try {
      const result = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });
      if (result.data) {
        dispatch(setLogin(result.data.token));
        dispatch(setUserId(result.data.userId));
        setMessage("");
        setStatus(true);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        setMessage(errorMessage);
      } else {
        setMessage("Error happened while Login, please try again");
      }
      setStatus(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setMessage("");
    if (!email) {
      setEmailError("Please enter your email to reset password");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      const result = await axios.post(
        "http://localhost:5000/users/forgot-password",
        {
          email,
        }
      );
      if (result.data.success) {
        setStatus(true);
        setMessage(
          "A password reset link has been sent to your email address. Please check your inbox and follow the instructions to reset your password."
        );
      } else {
        setMessage("Error: " + result.data.message);
      }
    } catch (error) {
      setMessage("Error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      history("/Home");
    }
  }, [isLoggedIn, history]);

  return (
    <div className="Login_Container">
      <div className="Login_Form">
        <p className="Title">Login:</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <div className="error-note">{emailError}</div>}

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <div className="error-note">{passwordError}</div>}
        {message && (
          <div
            className={status ? "SuccessMessage_login" : "ErrorMessage_login"}
          >
            {message}
          </div>
        )}
        <span
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </span>

        <div className="button-container_Login">
          <button onClick={login} className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : (
              "Login"
            )}
          </button>
          <a onClick={handleForgotPassword} className="forgot-password-link">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
