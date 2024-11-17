import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart:[]
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      console.log(state.products)
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    setCart: (state, action) => {
      state.cart=action.payload;
    },
  },
});

export const { setProducts, addProduct,setCart } = productSlice.actions;
export default productSlice.reducer;
