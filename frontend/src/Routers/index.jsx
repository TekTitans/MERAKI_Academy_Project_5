import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Details from "../pages/productdetails/Details";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import CompletedRegister from "../pages/CompleteRegister";
import Main from "../Layouts/Main";
import Contact from "../pages/Contact";
import Cart from "../pages/cart/Cart";
import ProfilePage from "../pages/ProfilePage";

import SearchPage from "../pages/Serach";
import Category from "../components/category";
import Products from "../pages/Products";
import SellerDashboard from "../pages/SellerDashboard";
import Chat from "../pages/chat/Chat";

import PlaceOrder from "../pages/place order/PlaceOrder";
export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Main />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/cart", element: <Cart /> },
        { path: "/placeOrder", element: <PlaceOrder /> },

        { path: "/users", element: <Register /> },
        { path: "/users/login", element: <Login /> },
        {
          path: "/users/reset-password/:resetToken",
          element: <ResetPassword />,
        },
        { path: "/details/:pId", element: <Details /> },
        { path: "/users/verifyEmail/:token", element: <VerifyEmail /> },
        {
          path: "/google-complete-register/:userId",
          element: <CompletedRegister />,
        },
        { path: "/Contact", element: <Contact /> },
        { path: "/Profile", element: <ProfilePage /> },

        { path: "*", element: <NotFound /> },
        { path: "/search/:query", element: <SearchPage /> },
        { path: "/category/:id", element: <Category /> },
        { path: "/products", element: <Products /> },
        { path: "/seller", element: <SellerDashboard /> },
        { path: "/chat", element: <Chat /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
