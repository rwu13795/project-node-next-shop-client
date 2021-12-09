import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

const initialState = {
  pageLoading: false,
  lockScrollBar: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setPageLoading(state, action: PayloadAction<boolean>) {
      console.log("setting pageLoading to", action.payload);
      state.pageLoading = action.payload;
    },
    setLockScrollBar(state, action: PayloadAction<boolean>) {
      state.lockScrollBar = action.payload;
    },
  },
});

export const { setPageLoading, setLockScrollBar } = layoutSlice.actions;

export default layoutSlice.reducer;

const selectLayoutState = (state: RootState) => state.layout;

// NOTE //
/* without using the create "createSelector" the "selectPageLoading" will be
   invoked 2 times more 
*/
// export const selectPageLoading = (state: RootState) => {
//   console.log("pageLoading selector");
//   return state.layout.pageLoading;
// };

export const selectPageLoading = createSelector(
  [selectLayoutState],
  (state) => {
    console.log("pageLoading selector");
    return state.pageLoading;
  }
);
export const selectLockScrollBar = createSelector(
  [selectLayoutState],
  (state) => {
    console.log("lockScrollbar selector");
    return state.lockScrollBar;
  }
);
