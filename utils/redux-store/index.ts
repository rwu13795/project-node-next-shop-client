import { configureStore } from "@reduxjs/toolkit";

import checkoutSlice from "./checkoutSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    checkout: checkoutSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
