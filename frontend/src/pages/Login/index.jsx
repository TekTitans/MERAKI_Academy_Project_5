import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setLogin,
  setUserId,
  setUserName,
  setIsCompletedRegister,
  setRoleId,
} from "../../components/redux/reducers/auth";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isCompletedRegister = useSelector((state) => state.auth.isLoggedIn);
  const userId = useSelector((state) => state.auth.userId);
  const roleId = useSelector((state) => state.auth.roleId);

  const history = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const normalizedRoleId = Number(roleId);

    if (!isLoggedIn || !isCompletedRegister || roleId === undefined) return;

    if (isLoggedIn && isCompletedRegister) {
      if (normalizedRoleId === 3) {
        history("/");
      } else {
        if (normalizedRoleId === 2) {
          history("/seller");
        } else {
          if (normalizedRoleId === 1) history("/admin");
        }
      }
    }
  }, [isLoggedIn, isCompletedRegister, roleId, history]);

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

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
    try {
      console.log("email :", email);
      console.log("password :", password);

      const result = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });
      if (result.data) {
        console.log("result:", result);
        dispatch(setLogin(result.data.token));
        dispatch(setUserId(result.data.userId));
        dispatch(setUserName(result.data.userName));
        dispatch(setRoleId(result.data.roleId));
        dispatch(setIsCompletedRegister(true));
        const normalizedRoleId = Number(roleId);

        console.log("role from Backend: ", result.data.roleId);
        console.log("role from Redux: ", roleId);
        setMessage("");
        setStatus(true);
        if (Number(result.data.roleId) === 3) {
          history("/");
        } else {
          if (Number(result.data.roleId) === 2) {
            history("/seller");
          } else {
            if (Number(result.data.roleId) === 1) history("/admin");
          }
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message ||
          "Error happened while Login, please try again"
      );
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
        { email }
      );
      setMessage(
        result.data.success
          ? "A password reset link has been sent to your email address. Please check your inbox and follow the instructions to reset your password."
          : "Error: " + result.data.message
      );
      setStatus(result.data.success);
    } catch {
      setMessage("Error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = (response) => {
    const { credential } = response;
    axios
      .post("http://localhost:5000/users/google-login", { token: credential })
      .then((res) => {
        dispatch(setLogin(res.data.token));
        dispatch(setUserId(res.data.userId));
        setIsCompletedRegister(res.data.isComplete);
        dispatch(setUserName(res.data.userName));
        dispatch(setRoleId(res.data.roleId));

        console.log("role from Backend: ", res.data.roleId);
        console.log("role from Redux: ", roleId);

        if (res.data.isComplete) {
          if (Number(res.data.roleId) === 3) {
            history("/");
          } else {
            if (Number(res.data.roleId) === 2) {
              history("/seller");
            } else {
              console.log(res);
              if (Number(res.data.roleId) === 1) history("/admin");
            }
          }
        } else {
          history(`/google-complete-register/${res.data.userId}`);
        }
      })
      .catch((err) => console.error("Google login error:", err));
  };

  const handleGoogleLoginFailure = (error) =>
    console.error("Google login failure:", error);

  const handleRegisterClick = () => {
    history("/users");
  };

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
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
          </span>
        </div>
        {passwordError && <div className="error-note">{passwordError}</div>}
        {message && (
          <div
            className={status ? "SuccessMessage_login" : "ErrorMessage_login"}
          >
            {message}
          </div>
        )}
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
          <div className="register-section">
            <span>Don't have an account?</span>
            <button onClick={handleRegisterClick} className="register-button">
              Register Here
            </button>
          </div>
          <div className="Google_Login_Container">
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
