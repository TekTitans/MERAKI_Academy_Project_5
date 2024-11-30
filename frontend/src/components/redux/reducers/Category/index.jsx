import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload;
      state.categories = state.categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      );
    },
    removeCategory: (state, action) => {
      const categoryId = action.payload;
      state.categories = state.categories.filter(
        (category) => category.id !== categoryId
      );
    },
  },
});

export const { setCategories, addCategory, updateCategory, removeCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
