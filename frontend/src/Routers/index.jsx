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
import ProfilePage from "../pages/ProfilePage";

import { Search } from "../pages/Serach";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Main />,
      children: [
        { path: "/", element: <Home /> },
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
        { path: "/search", element: <Search /> },
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
