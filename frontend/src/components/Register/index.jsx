import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/reducers/auth";

// =================================================================

const Register = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log("isLoggedIn: ", isLoggedIn);

  const [first_Name, setFirstName] = useState("");
  const [last_Name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(3);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  // =================================================================

  const addNewUser = async (e) => {
    e.preventDefault();
    if (
      !first_Name ||
      !last_Name ||
      !username ||
      !country ||
      !email ||
      !password
    ) {
      setMessage("All fields are required.");
      setStatus(false);
      return;
    }

    try {
      const result = await axios.post("http://localhost:5000/users", {
        first_Name,
        last_Name,
        username,
        role_id: role,
        country,
        email,
        password,
      });
      console.log(result);
      if (result.data.success) {
        setStatus(true);
        setMessage(result.data.message);
      } else {
        throw new Error(result.data.message || "Registration failed");
      }
    } catch (error) {
      setStatus(false);
      setMessage(
        error.response
          ? error.response.data.message
          : "Error happened while register, please try again"
      );
    }
  };

  const handleLogout = () => {
    dispatch(setLogout());
  };
  // =================================================================

  return (
    <div className="Form">
      {!isLoggedIn ? (
        <>
          <p className="Title">Register:</p>
          <form onSubmit={addNewUser}>
            <input
              type="text"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={first_Name}
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={last_Name}
            />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input
              type="text"
              placeholder="Country"
              onChange={(e) => setCountry(e.target.value)}
              value={country}
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="2"
                  checked={role === 2}
                  onChange={() => setRole(2)}
                />
                Seller
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="3"
                  checked={role === 3}
                  onChange={() => setRole(3)}
                />
                Customer
              </label>
            </div>
            <div className="button-container">
              <button type="submit">Register</button>
            </div>
          </form>

          {message && (
            <div className={status ? "SuccessMessage" : "ErrorMessage"}>
              {message}
            </div>
          )}
        </>
      ) : (
        <>
          <p>You are already logged in. Please log out first to register.</p>
          <div className="button-container">
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;
