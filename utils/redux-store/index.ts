import { configureStore } from "@reduxjs/toolkit";

import adminSlice from "./adminSlice";
import shopSlice from "./shopSlice";
import layoutSlice from "./layoutSlice";
import userSlice from "./userSlice";
import addProductSlice from "./addProductSlice";

const store = configureStore({
  reducer: {
    admin: adminSlice,
    user: userSlice,
    shop: shopSlice,
    layout: layoutSlice,
    add_product: addProductSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
