import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: [],
    search: "",
    catid: 0,
    count: 0,
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      state.products = state.products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
    },
    removeProduct: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter(
        (product) => product.id !== productId
      );
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    addCart: (state, action) => {
      state.cart.push(action.payload);
    },
    updateCart: (state, action) => {
      const updatedCart = action.payload;
      state.cart = state.cart.map((product) =>
        product.id === updatedCart.id ? updatedCart : product
      );
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter((product) => product.id !== productId);
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setcatid: (state, action) => {
      state.catid = action.payload;
    },
    incrementCount: (state) => {
      state.count += 1;
    },
    decrementCount: (state) => {
      if (state.count > 0) state.count -= 1;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setCart,
  setSearch,
  setcatid,
  incrementCount,
  decrementCount,
  addCart,
  updateCart,
  removeFromCart,
} = productSlice.actions;

export default productSlice.reducer;
