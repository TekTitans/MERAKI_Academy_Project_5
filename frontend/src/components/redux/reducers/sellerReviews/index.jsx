import { createSlice } from "@reduxjs/toolkit";

export const sellerReviewSlice = createSlice({
  name: "sellerReview",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSellerReviews: (state, action) => {
      state.reviews = action.payload;
    },
    addSellerReviews: (state, action) => {
      state.reviews.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSellerReviews, addSellerReviews, setLoading, setError } =
  sellerReviewSlice.actions;

export default sellerReviewSlice.reducer;
