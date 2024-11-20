import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  },
  reducers: {
    setLogin: (state, action) => {
      const token = action.payload;
      state.token = token;
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
      localStorage.setItem("token", token);
    },
    setUserId: (state, action) => {
      const userId = action.payload;
      state.userId = userId;
      localStorage.setItem("userId", userId);
    },
    setUserName: (state, action) => {
      const userName = action.payload;
      state.userName = userName;
      localStorage.setItem("userName", userName);
    },
    setLogout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.userId = null;
      state.userName = null;

      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName");
    },
  },
});

export const { setLogin, setUserId, setUserName, setLogout } =
  authSlice.actions;
export default authSlice.reducer;
