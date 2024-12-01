import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: sessionStorage.getItem("token"),
    userId: sessionStorage.getItem("userId"),
    roleId: sessionStorage.getItem("roleId"),
    userName: sessionStorage.getItem("userName"),
    isLoggedIn: JSON.parse(sessionStorage.getItem("isLoggedIn")) || false,
    isCompletedRegister:
      JSON.parse(sessionStorage.getItem("isCompletedRegister")) || false,
    allMessages: [],
    recived: [],
  },
  reducers: {
    clearRecived: (state, action) => {
      state.recived = [];
    },
    setAllMessages: (state, action) => {
      const messages = action.payload;
      state.allMessages = messages;
    },
    addToRecived: (state, action) => {
      state.recived = action.payload;
    },
    setLogin: (state, action) => {
      const token = action.payload;
      state.token = token;
      state.isLoggedIn = true;
      sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
      sessionStorage.setItem("token", token);
    },
    setUserId: (state, action) => {
      const userId = action.payload;
      state.userId = userId;
      sessionStorage.setItem("userId", userId);
    },
    setUserName: (state, action) => {
      const userName = action.payload;
      state.userName = userName;
      sessionStorage.setItem("userName", userName);
    },
    setRoleId: (state, action) => {
      const roleId = action.payload;
      state.roleId = roleId;
      sessionStorage.setItem("roleId", roleId);
    },
    setLogout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.userId = null;
      state.userName = null;
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("userName");
    },
    setIsCompletedRegister: (state, action) => {
      sessionStorage.setItem("isCompletedRegister", JSON.stringify(true));
    },
  },
});

export const {
  setLogin,
  setUserId,
  setUserName,
  setLogout,
  setAllMessages,
  clearRecived,
  addToRecived,
  setIsCompletedRegister,
  setRoleId,
} = authSlice.actions;
export default authSlice.reducer;
