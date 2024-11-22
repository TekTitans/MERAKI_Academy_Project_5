import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import productReducer from "./reducers/product/product";
import orderReducer from "./reducers/orders";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    order: orderReducer,
  },
});

export default store;
