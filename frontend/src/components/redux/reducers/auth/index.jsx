import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    userId: null,
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,  // Parse to boolean
  },
  reducers: {
    setLogin: (state, action) => {
      const token = action.payload;
      state.token = token;
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", JSON.stringify(true));  // Store as boolean
      localStorage.setItem("token", token);
    },
    setUserId: (state, action) => {
      const userId = action.payload;
      state.userId = userId;
      localStorage.setItem("userId", userId);
    },
    setLogout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.userId = null;
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
    },
  },
});

export const { setLogin, setUserId, setLogout } = authSlice.actions;
export default authSlice.reducer;
