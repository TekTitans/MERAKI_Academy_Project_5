import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import "./index.css";


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
      </>
      <Routes>
        <Route path="/users" element={<Register />} />
        <Route path="/users/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
