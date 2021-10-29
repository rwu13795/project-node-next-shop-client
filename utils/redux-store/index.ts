import { configureStore } from "@reduxjs/toolkit";

import adminSlice from "./adminSlice";
import checkoutSlice from "./checkoutSlice";
import pageLoadingSlice from "./pageLoadingSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    admin: adminSlice,
    user: userSlice,
    checkout: checkoutSlice,
    pageLoading: pageLoadingSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
