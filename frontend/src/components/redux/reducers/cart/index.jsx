import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    count: parseInt(sessionStorage.getItem("cartCount"), 10) || 0, 
  },
  reducers: {
    addToCart: (state, action) => {
      console.log("Action payload:", action.payload);
      const product = action.payload;
      const existingProduct = state.cart.find((item) => item.id === product.id);

      if (existingProduct) {
        console.log("Product exists, updating quantity...");
        existingProduct.quantity += parseInt(product.quantity, 10);
      } else {
        console.log("Adding new product to cart...");
        state.cart.push({
          ...product,
          quantity: parseInt(product.quantity, 10),
        });
        state.count += 1;
      }

      sessionStorage.setItem("cartCount", state.count);

      console.log("Updated cart:", state.cart);
      console.log("Total unique items:", state.count);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      const productIndex = state.cart.findIndex(
        (item) => item.id === productId
      );

      if (productIndex !== -1) {
        state.cart.splice(productIndex, 1);
        state.count -= 1;

        sessionStorage.setItem("cartCount", state.count);
      }
    },

    updateCart: (state, action) => {
      const updatedProduct = action.payload;
      const productIndex = state.cart.findIndex(
        (item) => item.id === updatedProduct.id
      );

      if (productIndex !== -1) {
        state.cart[productIndex] = {
          ...state.cart[productIndex],
          ...updatedProduct,
        };
      }
    },

    setCart: (state, action) => {
      state.cart = action.payload;
      state.count = action.payload.length;

      sessionStorage.setItem("cartCount", state.count);
    },

    clearCart: (state) => {
      state.cart = [];
      state.count = 0;

      sessionStorage.setItem("cartCount", state.count);
    },
  },
});

export const { setCart, addToCart, updateCart, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
