const express = require("express");
const userRouter = express.Router();
const {
    register,
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
const auth = require("../middleware/authentication");

// User routes
userRouter.post("/", register);
userRouter.post("/login", login);
userRouter.get("/profile", auth, getProfile);
userRouter.put("/profile", auth, updateProfile);
userRouter.put("/change-password", auth, updatePassword);
userRouter.delete("/profile", auth, deleteUserAccount);

// Deactivate/Reactivate routes
userRouter.put("/deactivate-profile", auth, deactivateUser); 
userRouter.put("/reactivate-profile", auth, reactivateUser); 

// Admin routes
userRouter.get("/admin", auth, AdminGetAllUsers);
userRouter.delete("/admin/:userId", auth, AdminRemoveUser);
userRouter.put("/admin/block/:userId", auth, AdminBlockUser);
userRouter.put("/admin/unblock/:userId", auth, AdminUnblockUser); 

// Password reset routes
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

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
