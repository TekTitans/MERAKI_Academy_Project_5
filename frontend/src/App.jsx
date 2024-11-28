import { router } from "./Routers";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51QPSRFEnC5NZk9CEPp8u01qyYffByEBW5nBWfJwy9Mi7IZJylECWjP6APQP6vWFAekhhu3YIzCsGJgRLv4CZkT0d00fcL4LqWW');

function App() {
 
  return (
    
    <GoogleOAuthProvider clientId="726146060309-4l2d4nuhqk4jhgj13fgg6unnfuii6d47.apps.googleusercontent.com">
      <div className="App">
      <Elements stripe={stripePromise}>

        <RouterProvider router={router} />
    </Elements>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
