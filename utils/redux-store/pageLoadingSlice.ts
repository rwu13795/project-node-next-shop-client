import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

const initialState = {
  pageLoading: false,
};

const pageLoadingSlice = createSlice({
  name: "pageLoading",
  initialState,
  reducers: {
    setPageLoading(state, action: PayloadAction<boolean>) {
      state.pageLoading = action.payload;
    },
  },
});

export const { setPageLoading } = pageLoadingSlice.actions;

export default pageLoadingSlice.reducer;

export const selectPageLoading = (state: RootState) =>
  state.pageLoading.pageLoading;
