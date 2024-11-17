import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"

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
  )
}

export default App;
