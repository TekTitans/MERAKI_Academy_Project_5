const express = require("express");
const userRouter = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/user");
const auth = require("../middleware/authentication");

userRouter.post("/", register);
userRouter.post("/login", login);
userRouter.get("/profile", auth, getProfile);
userRouter.put("/profile", auth, updateProfile);

module.exports = userRouter;

/*
 * Testing Object:
{
  "first_Name": "Sara",
  "last_Name": "Ahmad",
  "username": "sara123",
  "role_id": "1",
  "country": "Jordan",
  "email": "sara.alahmad@gmail.com",
  "password": "123456"
}
*/
