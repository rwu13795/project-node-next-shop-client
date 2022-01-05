import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

interface LayoutState {
  pageLoading: boolean;
  lockScrollBar: boolean;
  disable_searchInput: boolean;
}

const initialState: LayoutState = {
  pageLoading: false,
  lockScrollBar: false,
  disable_searchInput: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setPageLoading(state, action: PayloadAction<boolean>) {
      state.pageLoading = action.payload;
    },
    setLockScrollBar(state, action: PayloadAction<boolean>) {
      state.lockScrollBar = action.payload;
    },
    set_disable_searchInput(state, action: PayloadAction<boolean>) {
      state.disable_searchInput = action.payload;
    },
  },
});

export const { setPageLoading, setLockScrollBar, set_disable_searchInput } =
  layoutSlice.actions;

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
    return state.pageLoading;
  }
);
export const selectLockScrollBar = createSelector(
  [selectLayoutState],
  (state) => {
    return state.lockScrollBar;
  }
);
export const select_disable_searchInput = createSelector(
  [selectLayoutState],
  (state) => {
    return state.disable_searchInput;
  }
);
