import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import "./index.css";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <div className="App">
      <>
        <Link className="Link" to="/users">
          Register
        </Link>
        <Link className="Link" to="/users/login">
          Login
        </Link>
        <Link className="Link" to="/users/reset-password/:resetToken">
          Reset Password
        </Link>
      </>
      <Routes>
        <Route path="/users" element={<Register />} />
        <Route path="/users/login" element={<Login />} />
        <Route
          path="/users/reset-password/:resetToken"
          element={<ResetPassword />}
        />
      </Routes>
    </div>
  );
}

export default App;
