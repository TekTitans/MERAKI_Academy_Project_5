import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../components/redux/reducers/auth";

const Register = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [formData, setFormData] = useState({
    first_Name: "",
    last_Name: "",
    username: "",
    country: "",
    email: "",
    password: "",
    role_id: 3,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const {
      first_Name,
      last_Name,
      username,
      country,
      email,
      password,
      role_id,
    } = formData;
    const errors = {};

    if (!first_Name) errors.first_Name = "First name is required.";
    if (!last_Name) errors.last_Name = "Last name is required.";
    if (!username) errors.username = "Username is required.";
    if (!country) errors.country = "Country is required.";
    if (!email) errors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "Please enter a valid email address.";
    if (!password) errors.password = "Password is required.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addNewUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage("Please fill out all required fields correctly.");
      setStatus(false);
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post("http://localhost:5000/users", formData);
      if (result.data.success) {
        setStatus(true);
        setMessage(result.data.message);
        setFormData({
          first_Name: "",
          last_Name: "",
          username: "",
          country: "",
          email: "",
          password: "",
          role_id: 3,
        });
      } else {
        throw new Error(result.data.message || "Registration failed");
      }
    } catch (error) {
      setStatus(false);
      setMessage(
        error.response?.data?.message ||
          "Error happened while registering, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(setLogout());
  };

  const getInputClassName = (field) => {
    return errors[field] ? "input-error" : "";
  };

  const handleRoleSelection = (role) => {
    setFormData({ ...formData, role });
  };

  return (
    <div className="Register_Container">
      <div className="Register_Form">
        {!isLoggedIn ? (
          <>
            <h1 className="Title">Register</h1>
            <form onSubmit={addNewUser}>
              <div className="input-group">
                <input
                  type="text"
                  name="first_Name"
                  placeholder="First Name"
                  onChange={handleInputChange}
                  value={formData.first_Name}
                  className={getInputClassName("first_Name")}
                />
                {errors.first_Name && (
                  <div className="error-note">{errors.first_Name}</div>
                )}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="last_Name"
                  placeholder="Last Name"
                  onChange={handleInputChange}
                  value={formData.last_Name}
                  className={getInputClassName("last_Name")}
                />
                {errors.last_Name && (
                  <div className="error-note">{errors.last_Name}</div>
                )}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleInputChange}
                  value={formData.username}
                  className={getInputClassName("username")}
                />
                {errors.username && (
                  <div className="error-note">{errors.username}</div>
                )}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  onChange={handleInputChange}
                  value={formData.country}
                  className={getInputClassName("country")}
                />
                {errors.country && (
                  <div className="error-note">{errors.country}</div>
                )}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                  value={formData.email}
                  className={getInputClassName("email")}
                />
                {errors.email && (
                  <div className="error-note">{errors.email}</div>
                )}
              </div>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                  value={formData.password}
                  className={getInputClassName("password")}
                />
                {errors.password && (
                  <div className="error-note">{errors.password}</div>
                )}
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              <div className="role-selection-container">
                <h3>Select Your Role</h3>
                <div className="role-cards">
                  <div
                    className={`role-card ${
                      formData.role === 2 ? "selected" : ""
                    }`}
                    onClick={() => handleRoleSelection(2)}
                  >
                    <h4>Seller</h4>
                  </div>
                  <div
                    className={`role-card ${
                      formData.role === 3 ? "selected" : ""
                    }`}
                    onClick={() => handleRoleSelection(3)}
                  >
                    <h4>Customer</h4>
                  </div>
                </div>
                {errors.role && <div className="error-note">{errors.role}</div>}
              </div>

              {message && (
                <div className={status ? "SuccessMessage" : "ErrorMessage"}>
                  {message}
                </div>
              )}

              <div className="button-container_Register">
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? (
                    <div className="spinner-container">
                      <div className="spinner_Register"></div>
                    </div>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <p>You are already logged in. Please log out first to register.</p>
            <div className="button-container">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
