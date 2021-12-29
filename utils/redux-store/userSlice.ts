import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";

import browserClient from "../axios-client/browser-client";
import { inputNames } from "../enums-types/input-names";
import { InputValues } from "../helper-functions/input-error-check";
import { loadingStatus } from "../enums-types/loading-status";

interface StockError {
  index?: number;
  msg?: string;
}

interface UserInfo {
  [inputNames.first_name]: string;
  [inputNames.last_name]: string;
  [inputNames.address_1]: string;
  [inputNames.address_2]: string;
  [inputNames.city]: string;
  [inputNames.state]: string;
  [inputNames.zip_code]: string;
  [inputNames.phone]: string;
}

export interface CartItem {
  imageUrl: string;
  title: string;
  main_cat: string;
  sub_cat: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  colorName: string;
  colorCode: string;
  availableQty: number;
  stockError: string;
}

export interface CurrentUser {
  username: string;
  cart: CartItem[];
  isLoggedIn: boolean | undefined;
  email?: string;
  userId?: string;
  userInfo?: UserInfo;
}

export interface AuthErrors {
  [inputName: string]: string;
}

interface SignUpBody {
  email: string;
  password: string;
  confirm_password: string;
  userInfo: UserInfo;
}
interface SignInBody {
  email: string;
  password: string;
}

interface EditItem {
  index: number;
  item: CartItem;
}

interface UserState {
  currentUser: CurrentUser;
  changeInCart: boolean;
  loadingStatus: string;
  authErrors: AuthErrors;
  csrfToken: string;
  editItem?: EditItem;
  pageLoading_user: boolean;
  profileTagNum: string;
}

const initialState: UserState = {
  currentUser: { username: "", cart: [], isLoggedIn: undefined },
  changeInCart: false,
  loadingStatus: "idle",
  authErrors: {},
  csrfToken: "",
  pageLoading_user: false,
  profileTagNum: "2",
};

const client = browserClient();
const serverUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}`;

//////////////
// GET AUTH //
//////////////
const getUserStatus = createAsyncThunk("user/getUserStatus", async () => {
  const response = await client.get<UserState>(serverUrl + "/auth/user-status");

  return response.data;
});

//////////////
// SIGN IN  //
//////////////
const signIn = createAsyncThunk<UserState, SignInBody, { state: RootState }>(
  "user/signIn",
  async (
    signInBody,
    // NOTE//
    // if you need to customize the contents of the rejected action, you should
    // catch any errors yourself, and then return a new value using the
    // thunkAPI.rejectWithValue
    thunkAPI
  ) => {
    try {
      const response = await client.post(serverUrl + "/auth/sign-in", {
        email: signInBody.email,
        password: signInBody.password,
      });
      return response.data;
    } catch (err: any) {
      // catch the error sent from the server manually, and put it in inside the action.payload
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

//////////////
// SIGN OUT //
//////////////
const signOut = createAsyncThunk("user/signOut", async () => {
  await client.post(serverUrl + "/auth/sign-out");
  return;
});

/////////////
// SIGN UP //
/////////////
const signUp = createAsyncThunk<UserState, SignUpBody, { state: RootState }>(
  "user/signUp",
  async (signUpBody, thunkAPI) => {
    try {
      const response = await client.post(serverUrl + "/auth/sign-up", {
        email: signUpBody.email,
        password: signUpBody.password,
        confirm_password: signUpBody.confirm_password,
        userInfo: signUpBody.userInfo,
      });
      return response.data;
    } catch (err: any) {
      // catch the error sent from the server manually, and put it in inside the action.payload
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

//////////
// CART //
//////////
const addToCartSession = createAsyncThunk<
  UserState,
  {
    item: CartItem;
    editMode?: boolean;
    index?: number;
  }
>("user/addToCartSession", async ({ item, editMode, index }) => {
  const response = await client.post(serverUrl + "/shop/add-to-cart", {
    item,
    editMode,
    index,
  });

  return response.data;
});

const removeFromCartSession = createAsyncThunk<UserState, number>(
  "user/removeFromCartSession",
  async (index) => {
    const response = await client.post(serverUrl + "/shop/remove-from-cart", {
      index,
    });
    return response.data;
  }
);

const directChangeQty = createAsyncThunk<
  UserState,
  { quantity: number; index: number }
>("user/directChangeQty", async ({ quantity, index }) => {
  const response = await client.post(serverUrl + "/shop/change-quantity", {
    quantity,
    index,
  });
  return response.data;
});

const clearCartSession = createAsyncThunk<UserState>(
  "user/clearCartSession",
  async () => {
    const response = await client.post(serverUrl + "/shop/clear-cart");
    return response.data;
  }
);

///////////
// STOCK //
///////////
const checkStock = createAsyncThunk<{
  cart: CartItem[];
  stockErrors?: StockError[];
}>("user/checkStock", async () => {
  const response = await client.get(serverUrl + "/shop/check-stock");
  return response.data;
});

const updateStock = createAsyncThunk("user/updateStock", async () => {
  const response = await client.put(serverUrl + "/products/update-stock");
});

/////////////////
// UPDATE INFO //
/////////////////
const updateUserInfo = createAsyncThunk<
  UserState,
  { inputValues: InputValues },
  { state: RootState }
>("user/updateUserInfo", async ({ inputValues }, thunkAPI) => {
  // compare the values before sending them to server, if nothing changes
  // return an "no_change" authErrors to the "fullfilled"
  let userInfo = thunkAPI.getState().user.currentUser.userInfo;
  if (userInfo !== undefined) {
    let noChange = true;
    for (let [key, value] of Object.entries(userInfo)) {
      if (value !== inputValues[key]) {
        noChange = false;
        break;
      }
    }
    if (noChange) {
      return { authErrors: { no_change: "no_change" } };
    }
  }

  const response = await client.post(serverUrl + "/auth/update-info", {
    update: inputValues,
    csrfToken: thunkAPI.getState().user.csrfToken,
    userId: thunkAPI.getState().user.currentUser.userId,
  });
  return response.data;
});

////////////////////
// RESET PASSWORD //
////////////////////
const resetPassword = createAsyncThunk<
  void,
  {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  },
  { state: RootState }
>("user/resetPassword", async (body, thunkAPI) => {
  try {
    const csrfToken = thunkAPI.getState().user.csrfToken;
    await client.post(serverUrl + "/auth/reset-password", {
      ...body,
      csrfToken,
    });
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

/////////////////////
// FORGOT PASSWORD //
/////////////////////
const forgotPassword_Request = createAsyncThunk<
  void,
  string,
  { state: RootState }
>("user/forgotPassword_Request", async (email, thunkAPI) => {
  try {
    await client.post(serverUrl + "/auth/forgot-password-request", {
      email,
    });
    return;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

const forgotPassword_Reset = createAsyncThunk<
  void,
  {
    new_password: string;
    confirm_new_password: string;
    token: string;
    userId: string;
  },
  { state: RootState }
>("user/forgotPassword_Reset", async (body, thunkAPI) => {
  try {
    await client.post(serverUrl + "/auth/forgot-password-reset", {
      ...body,
    });
    return;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

////////////////////////////////////////////////////////////////////////////////

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearAuthErrors(state, action: PayloadAction<string>) {
      if (action.payload === "all") {
        state.authErrors = {};
      } else {
        state.authErrors[action.payload] = "";
      }
    },
    setChangeInCart(state, action: PayloadAction<boolean>) {
      state.changeInCart = action.payload;
    },
    setLoadingStatus(state, action: PayloadAction<string>) {
      state.loadingStatus = action.payload;
    },
    clearStockErrors(state, action: PayloadAction<number>) {
      state.currentUser.cart[action.payload].stockError = "";
    },
    setEditItem(state, action: PayloadAction<EditItem>) {
      state.editItem = action.payload;
    },
    setPageLoading_user(state, action: PayloadAction<boolean>) {
      state.pageLoading_user = action.payload;
    },
    setProfileTagNum(state, action: PayloadAction<string>) {
      state.profileTagNum = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //////////////
      // GET AUTH //
      //////////////
      .addCase(
        getUserStatus.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          // remember to add the state type as return type
          state.currentUser = action.payload.currentUser;
          state.csrfToken = action.payload.csrfToken;
        }
      )
      /////////////
      // SIGN IN //
      /////////////
      .addCase(
        signIn.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
          state.loadingStatus = "succeeded";
        }
      )
      .addCase(signIn.pending, (state): void => {
        state.loadingStatus = "loading";
      })
      .addCase(signIn.rejected, (state, action: PayloadAction<any>): void => {
        for (let err of action.payload.errors) {
          state.authErrors[err.field] = err.message;
        }
        state.loadingStatus = "failed";
        state.pageLoading_user = false;
      })
      //////////////
      // SIGN OUT //
      //////////////
      .addCase(signOut.fulfilled, (state, action): void => {
        state.currentUser.isLoggedIn = false;
        state.loadingStatus = "idle";
      })
      /////////////
      // SIGN UP //
      /////////////
      .addCase(
        signUp.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
          state.loadingStatus = "succeeded";
          state.pageLoading_user = false;
        }
      )
      .addCase(signUp.pending, (state, action): void => {
        state.loadingStatus = "loading";
        state.pageLoading_user = true;
      })
      .addCase(signUp.rejected, (state, action: PayloadAction<any>): void => {
        for (let err of action.payload.errors) {
          state.authErrors[err.field] = err.message;
        }
        state.loadingStatus = "idle";
        state.pageLoading_user = false;
      })
      /////////////////
      // ADD TO CART //
      /////////////////
      .addCase(
        addToCartSession.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
          state.changeInCart = true;
        }
      )
      .addCase(
        directChangeQty.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
        }
      )
      //////////////////////
      // REMOVE FROM CART //
      //////////////////////
      .addCase(
        removeFromCartSession.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
        }
      )
      .addCase(
        clearCartSession.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
        }
      )
      /////////////////
      // UPDATE INFO //
      /////////////////
      .addCase(
        updateUserInfo.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          if (action.payload.authErrors !== undefined) {
            state.authErrors["no_change"] = "You did not change anything";
            state.loadingStatus = loadingStatus.idle;
          } else {
            state.currentUser = action.payload.currentUser;
            state.loadingStatus = loadingStatus.succeeded;
          }
        }
      )
      .addCase(updateUserInfo.pending, (state): void => {
        state.loadingStatus = "loading";
      })
      /////////////////
      // CHECK STOCK //
      /////////////////
      .addCase(
        checkStock.fulfilled,
        (
          state,
          action: PayloadAction<{
            cart: CartItem[];
            stockErrors?: StockError[];
          }>
        ): void => {
          state.currentUser.cart = action.payload.cart;
          if (action.payload.stockErrors) {
            for (let error of action.payload.stockErrors) {
              // NOTE //
              // have to use "typeof" to check the index, because when index = 0
              // it will return false for just checking "error.msg"
              if (typeof error.index === "number" && error.msg) {
                state.currentUser.cart[error.index].stockError = error.msg;
              }
            }
          }
        }
      )
      ////////////////////
      // RESET PASSWORD //
      ////////////////////
      .addCase(resetPassword.fulfilled, (state, action): void => {
        state.loadingStatus = "reset_password_succeeded";
      })
      .addCase(resetPassword.pending, (state, action): void => {
        state.loadingStatus = "loading";
      })
      .addCase(
        resetPassword.rejected,
        (state, action: PayloadAction<any>): void => {
          for (let err of action.payload.errors) {
            state.authErrors[err.field] = err.message;
          }
          state.loadingStatus = loadingStatus.failed;
        }
      )
      ////////////////////
      // FORGOT PASSWORD //
      ////////////////////
      .addCase(forgotPassword_Request.fulfilled, (state): void => {
        state.loadingStatus = loadingStatus.succeeded;
      })
      .addCase(forgotPassword_Request.pending, (state): void => {
        state.loadingStatus = loadingStatus.loading;
      })
      .addCase(
        forgotPassword_Request.rejected,
        (state, action: PayloadAction<any>): void => {
          state.loadingStatus = loadingStatus.failed;
          for (let err of action.payload.errors) {
            state.authErrors[err.field] = err.message;
          }
        }
      )
      .addCase(forgotPassword_Reset.fulfilled, (state): void => {
        state.loadingStatus = loadingStatus.succeeded;
      })
      .addCase(forgotPassword_Reset.pending, (state): void => {
        state.loadingStatus = loadingStatus.loading;
      })
      .addCase(
        forgotPassword_Reset.rejected,
        (state, action: PayloadAction<any>): void => {
          for (let err of action.payload.errors) {
            state.authErrors[err.field] = err.message;
            if (err.field === "expired-link") {
              state.loadingStatus = loadingStatus.time_out;
            }
          }
          if (state.loadingStatus !== loadingStatus.time_out) {
            state.loadingStatus = loadingStatus.failed;
          }
        }
      );
  },
});

export const {
  clearAuthErrors,
  setChangeInCart,
  setLoadingStatus,
  clearStockErrors,
  setEditItem,
  setPageLoading_user,
  setProfileTagNum,
} = userSlice.actions;

export {
  signIn,
  signOut,
  signUp,
  getUserStatus,
  addToCartSession,
  directChangeQty,
  removeFromCartSession,
  clearCartSession,
  updateUserInfo,
  checkStock,
  updateStock,
  resetPassword,
  forgotPassword_Request,
  forgotPassword_Reset,
};

export default userSlice.reducer;

// NOTE from Redux Docs //
// In typical Reselect usage, you write your top-level "input selectors" as plain functions,
// and use createSelector to create memoized selectors that look up nested value
const selectUser = (state: RootState) => state.user;
export const selectCurrentUser = createSelector(
  [selectUser],
  (userState) => userState.currentUser
);
export const selectAuthErrors = createSelector(
  [selectUser],
  (userState) => userState.authErrors
);

// use the "createSelector" to create a memoized selector
// so the the selector will not re-select if the un-related state change in the same page
export const selectIsLoggedIn = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser.isLoggedIn
);
export const selectLoadingStatus_user = createSelector(
  [selectUser],
  (userState) => userState.loadingStatus
);
export const selectCart = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser.cart
);
export const selectChangeInCart = createSelector(
  [selectUser],
  (userState) => userState.changeInCart
);
export const selectTotalAmount = createSelector([selectCart], (cart) => {
  let total = 0;
  for (let item of cart) {
    total = item.price * item.quantity + total;
  }
  return Math.round(total * 100) / 100;
});
export const selectCsrfToken = createSelector(
  [selectUser],
  (userState) => userState.csrfToken
);
export const selectEditItem = createSelector(
  [selectUser],
  (userState) => userState.editItem
);
export const selectPageLoading_user = createSelector(
  [selectUser],
  (userState) => userState.pageLoading_user
);
export const selectProfileTagNum = createSelector(
  [selectUser],
  (userState) => userState.profileTagNum
);
