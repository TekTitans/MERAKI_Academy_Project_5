const express = require("express");

const auth = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const checkBlockedkUser = require("../middleware/checkBlockedkUser");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload");  

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
  googleLogin,
  completeRegister,
} = require("../controllers/user");

// Public Routes (No Auth or status check)
userRouter.post("/", register);
userRouter.post("/verifyEmail/:token", verifyEmail);

// Protected User Routes ( User Block/Unverified Check)
userRouter.post("/login", checkBlockedkUser, login);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

// Google Sign-In Route
userRouter.post("/google-login", googleLogin);
userRouter.post("/google-complete-register/:userId", completeRegister);

// Protected User Routes ( Auth )
userRouter.get("/profile", auth, getProfile);
userRouter.put("/profile", auth, upload.single("profile_image"), updateProfile);
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
