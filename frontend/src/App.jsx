import { router } from "./Routers";
import { RouterProvider } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";

function App() {
  return (
    <GoogleOAuthProvider clientId="726146060309-4l2d4nuhqk4jhgj13fgg6unnfuii6d47.apps.googleusercontent.com">
      <div className="App">

        <RouterProvider router={router} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
