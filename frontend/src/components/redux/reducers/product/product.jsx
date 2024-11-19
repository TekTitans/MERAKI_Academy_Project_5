import { createSlice } from "@reduxjs/toolkit";
import { Search } from "../../../../pages/Serach";
import { act } from "react";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: [],
    search: "",
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setProducts, addProduct, setCart, setSearch } =
  productSlice.actions;
export default productSlice.reducer;
