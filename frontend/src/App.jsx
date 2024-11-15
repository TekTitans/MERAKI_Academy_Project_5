
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./index.css";
import Navbar from "./components/navbar/Navbar";
import { Home } from "./pages/home/Home";
import Details from "./pages/productdetails/Details";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import CompletedRegister from "./pages/CompleteRegister";

function App() {
  return (
    <GoogleOAuthProvider clientId="726146060309-4l2d4nuhqk4jhgj13fgg6unnfuii6d47.apps.googleusercontent.com">
      <div className="App">
          <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />

          <Route path="/users" element={<Register />} />
          <Route path="/users/login" element={<Login />} />
          <Route
            path="/users/reset-password/:resetToken"
            element={<ResetPassword />}
          />
                    <Route path="/details/:pId" element={<Details />} />

          <Route path="/users/verifyEmail/:token" element={<VerifyEmail />} />
          <Route
            path="/google-complete-register/:userId"
            element={<CompletedRegister />}
          />
        </Routes>
      </div>
    </GoogleOAuthProvider>

  );
}

export default App;
