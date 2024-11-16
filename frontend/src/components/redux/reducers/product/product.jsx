import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    filterdProduct: (state, action) => {
      state.products = state.products.filter((product) => {
        return product.category_id === action.payload;
      });
    },
  },
});

export const { setProducts, addProduct, filterdProduct } = productSlice.actions;
export default productSlice.reducer;
