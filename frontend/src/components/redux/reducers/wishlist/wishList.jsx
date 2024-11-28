import { createSlice } from "@reduxjs/toolkit";

export const wishSlice = createSlice({
  name: "wishlist",
  initialState: {
    count: 0,
  },
  reducers: {
    incrementCount: (state) => {
      state.count += 1;
    },
    decrementCount: (state) => {
      if (state.count > 0) state.count -= 1;
    },
  },
});

export const { incrementCount, decrementCount } = wishSlice.actions;

export default wishSlice.reducer;
