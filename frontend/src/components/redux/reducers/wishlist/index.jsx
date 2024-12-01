import { createSlice } from "@reduxjs/toolkit";

const initialWishlist = JSON.parse(sessionStorage.getItem("wishlist")) || [];

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: initialWishlist,
  reducers: {
    addProductToWishlist(state, action) {
      const productId = action.payload;
      if (!state.includes(productId)) {
        state.push(productId);
      }
      sessionStorage.setItem("wishlist", JSON.stringify(state)); // Save to sessionStorage
    },
    removeProductFromWishlist(state, action) {
      const productId = action.payload;
      const updatedWishlist = state.filter((id) => id !== productId);
      sessionStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Save to sessionStorage
      return updatedWishlist;
    },
    setWishlist(state, action) {
      const newWishlist = action.payload;
      sessionStorage.setItem("wishlist", JSON.stringify(newWishlist)); // Save to sessionStorage
      return newWishlist;
    },
  },
});

export const { addProductToWishlist, removeProductFromWishlist, setWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
