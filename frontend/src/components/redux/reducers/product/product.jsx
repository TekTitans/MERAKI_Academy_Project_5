import { createSlice } from '@reduxjs/toolkit';

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    cart: [],
    search: '',
    catid: 0,
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
      state.products = state.products.filter((product) => product.id !== productId);
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setcatid: (state, action) => {
      state.catid = action.payload;
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
} = productSlice.actions;

export default productSlice.reducer;
