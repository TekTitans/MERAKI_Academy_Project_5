import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import productReducer from "./reducers/product/product";
import orderReducer from "./reducers/orders";
import sellerReviewReducer from "./reducers/sellerReviews";
import categoryReducer from "./reducers/Category";
import cartReducer from "./reducers/cart";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    order: orderReducer,
    sellerReview: sellerReviewReducer,
    category: categoryReducer,
    cart: cartReducer,
  },
});

export default store;
