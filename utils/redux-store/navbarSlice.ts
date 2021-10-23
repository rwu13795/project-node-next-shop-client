import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageLoading: false,
  menuListOnFocus: false,
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {},
});
