import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "amazon",
  initialState: {
    formDetails: null,
    user: null,
    searchData: "",
    cartForUser: [],
    categorySelected: "/",
  },
  reducers: {
    changeCategory: (state, action) => {
      state.categorySelected = action.payload;
    },

    addToCartArray: (state, action) => {
      state.cartForUser = [...state.cartForUser, action.payload];
    },
    emptyCartArray: (state) => {
      state.cartForUser = [];
    },
    removeItemFromCartArray: (state, action) => {
      state.cartForUser = state.cartForUser.filter(
        (element) => element !== action.payload
      );
    },
    addToFormData: (state, action) => {
      state.formDetails = action.payload;
    },
    resetForm: (state) => {
      state.formDetails = null;
    },
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    AddnlDataForUser: (state, action) => {
      state.user.AvatarSrc = action.payload;
    },
    ChangeNameForUser: (state, action) => {
      state.user.Name = action.payload;
    },
    ChangeAddressForUser: (state, action) => {
      state.user.address = action.payload;
    },
    ChangeDOBForUser: (state, action) => {
      state.user.DOB = action.payload;
    },
    changeSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    clearSearchData: (state) => {
      state.searchData = "";
    },
  },
});

export const {
  changeCategory,
  removeItemFromCartArray,
  addToCartArray,
  emptyCartArray,
  clearSearchData,
  changeSearchData,
  ChangeAddressForUser,
  ChangeDOBForUser,
  ChangeNameForUser,
  addToFormData,
  resetForm,
  login,
  logout,
  AddnlDataForUser,
} = counterSlice.actions;
export const selectSearchInput = (state) => state.amazon.searchData;
export const selectUser = (state) => state.amazon.user;
export const selectFormDetails = (state) => state.amazon.formDetails;
export const selectCart = (state) => state.amazon.cartForUser;
export const selectCategory = (state) => state.amazon.categorySelected;
export default counterSlice.reducer;
