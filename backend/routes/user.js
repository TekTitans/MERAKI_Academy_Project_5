const express = require("express");

const auth = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const checkBlockedkUser = require("../middleware/checkBlockedkUser");
const adminAuth = require("../middleware/adminAuth");

const userRouter = express.Router();
const {
  register,
  verifyEmail,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  deactivateUser,
  reactivateUser,
  deleteUserAccount,
  AdminGetAllUsers,
  AdminRemoveUser,
  AdminBlockUser,
  AdminUnblockUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");

// Public Routes (No Auth or status check)
userRouter.post("/", register);
userRouter.post("/verifyEmail/:token", verifyEmail);

// Protected User Routes ( User Block/Unverified Check)
userRouter.post("/login", checkBlockedkUser, login);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password",resetPassword);

// Protected User Routes ( Auth )

userRouter.get("/profile", auth, getProfile);
userRouter.put("/profile", auth, updateProfile);
userRouter.put("/change-password", auth, updatePassword);
userRouter.delete("/profile", auth, deleteUserAccount);

// Account Status Management Routes
userRouter.put("/deactivate-profile", auth, deactivateUser);
userRouter.put("/reactivate-profile", auth, reactivateUser);

// Admin Routes (Admin Auth and Authorization)
userRouter.get(
  "/admin",
  auth,
  adminAuth,
  authorization("can_view_all_users"),
  AdminGetAllUsers
);
userRouter.delete(
  "/admin/:userId",
  auth,
  adminAuth,
  authorization("can_remove_user"),
  AdminRemoveUser
);
userRouter.put(
  "/admin/block/:userId",
  auth,
  adminAuth,
  authorization("can_block_user"),
  AdminBlockUser
);
userRouter.put(
  "/admin/unblock/:userId",
  auth,
  adminAuth,
  authorization("can_unblock_user"),
  AdminUnblockUser
);

module.exports = userRouter;

/*
 * Testing Object:

   *register:
{
  "first_Name": "Sara",
  "last_Name": "Ahmad",
  "username": "sara123",
  "role_id": "1",
  "country": "Jordan",
  "email": "sara.alahmad@gmail.com",
  "password": "123456"
}

   *UpdateProfile:
{
    firstName: "Admin",
    lastName: "Al-Khateeb",
    country: "Jordan",
    location: "Amman",
    profile_image: "https://example.com/profile.jpg"
  }


*/
