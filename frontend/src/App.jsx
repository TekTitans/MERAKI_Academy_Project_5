import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";

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
      <h1>App Component</h1>
      <Routes>
        <Route path="/users" element={<Register />} />
        <Route path="/users/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
