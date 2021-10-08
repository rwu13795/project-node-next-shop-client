import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";

import browserClient from "../axios-client/browser-client";
import { inputNames } from "../enums-types/input-names";
import { InputValue } from "../helper-functions/input-error-check";

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
  productId: string;
  quantity: number;
  size: string;
  price: number;
  colorName: string;
  availableQty: number;
  stockErrors: {
    outOfStock?: string;
    notEnough?: string;
  };
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

interface UserState {
  currentUser: CurrentUser;
  changeInCart: boolean;
  loadingStatus: string;
  authErrors: AuthErrors;
  csrfToken: string;
}

const initialState: UserState = {
  currentUser: { username: "", cart: [], isLoggedIn: undefined },
  changeInCart: false,
  loadingStatus: "idle",
  authErrors: {},
  csrfToken: "",
};

const client = browserClient();
const serverUrl = "http://localhost:5000/api";

const getUserStatus = createAsyncThunk("user/getUserStatus", async () => {
  const response = await client.get<UserState>(serverUrl + "/auth/user-status");

  return response.data;
});

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
      // catch the error sent from the server manually, and put in inside the action.payload
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const signOut = createAsyncThunk("user/signOut", async () => {
  await client.post(serverUrl + "/auth/sign-out");
  console.log("in redux --- signing out");
  return;
});

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
      // catch the error sent from the server manually, and put in inside the action.payload
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

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

const clearCartSession = createAsyncThunk("user/clearCartSession", async () => {
  const response = await client.post(serverUrl + "/shop/clear-cart");
  return response.data;
});

const updateUserInfo = createAsyncThunk<
  UserState,
  { inputValue: InputValue },
  { state: RootState }
>("user/updateUserInfo", async ({ inputValue }, thunkAPI) => {
  // compare the values before sending them to server, if nothing changes
  // return an "no_change" authErrors to the "fullfilled"
  let userInfo = thunkAPI.getState().user.currentUser.userInfo;
  if (userInfo !== undefined) {
    let noChange = true;
    for (let [key, value] of Object.entries(userInfo)) {
      if (value !== inputValue[key]) {
        noChange = false;
        break;
      }
    }
    if (noChange) {
      return { authErrors: { no_change: "no_change" } };
    }
  }

  const response = await client.post(serverUrl + "/auth/update-info", {
    update: inputValue,
    csrfToken: thunkAPI.getState().user.csrfToken,
    userId: thunkAPI.getState().user.currentUser.userId,
  });
  return response.data;
});

const checkStock = createAsyncThunk<CartItem[]>("user/checkStock", async () => {
  const response = await client.get(serverUrl + "/shop/check-stock");
  return response.data;
});

const updateQuantity = createAsyncThunk("user/updateQuantity", async () => {
  const response = await client.put(serverUrl + "/products/update-quantity");
  console.log(response);
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearAuthErrors(state, action: PayloadAction<string>) {
      state.authErrors[action.payload] = "";
    },
    setChangeInCart(state, action: PayloadAction<boolean>) {
      state.changeInCart = action.payload;
    },
    setLoadingStatus(state, action: PayloadAction<string>) {
      state.loadingStatus = action.payload;
    },
    clearStockErrors(state, action: PayloadAction<number>) {
      state.currentUser.cart[action.payload].stockErrors = {};
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
          console.log("in redux getUserStatus---------->", state.currentUser);
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
      .addCase(signIn.pending, (state, action): void => {
        state.loadingStatus = "loading";
      })
      .addCase(signIn.rejected, (state, action: PayloadAction<any>): void => {
        //////////
        console.log(action.payload);
        //////////
        for (let err of action.payload.errors) {
          state.authErrors[err.field] = err.message;
        }
        state.loadingStatus = "idle";
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
        }
      )
      .addCase(signUp.pending, (state, action): void => {
        state.loadingStatus = "loading";
      })
      .addCase(signUp.rejected, (state, action: PayloadAction<any>): void => {
        ////////
        console.log(action.payload);
        ////////
        for (let err of action.payload.errors) {
          state.authErrors[err.field] = err.message;
        }
        state.loadingStatus = "idle";
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
            state.loadingStatus = "idle";
          } else {
            state.currentUser = action.payload.currentUser;
            state.loadingStatus = "succeeded";
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
        (state, action: PayloadAction<CartItem[]>): void => {
          state.currentUser.cart = action.payload;
          for (let item of state.currentUser.cart) {
            if (!item.stockErrors) {
              item.stockErrors = {};
            }
            if (item.quantity > item.availableQty && item.availableQty > 0) {
              item.stockErrors.notEnough = `Previously selected quantities (${item.quantity}) not available`;
              item.quantity = item.availableQty;
            }
            if (item.availableQty === 0) {
              item.stockErrors.outOfStock = "Out of stock";
              item.quantity = 0;
            }
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
  updateQuantity,
};

export default userSlice.reducer;

// create the selectors which select the root of the state
// and use this inside the "createSelector"
const selectUser = (state: RootState) => state.user;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectAuthErrors = (state: RootState) => state.user.authErrors;
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
