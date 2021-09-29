import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";

import browserClient from "../axios-client/browser-client";
import { inputNames } from "../enums-types/input-names";

interface UserAddressFields {
  [inputNames.address_1]: string;
  [inputNames.address_2]: string;
  [inputNames.state]: string;
  [inputNames.city]: string;
  [inputNames.zip_code]: string;
}

// the totalQty of a specific product was added to the cart also when
// user add this product to cart, so that I can map the "SelectQuantity"
// in the cartDetail without making request to the server again
export interface CartItem {
  imageUrl: string;
  title: string;
  main_cat: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  colorName: string;
  totalQty?: number;
}

export interface CurrentUser {
  username: string;
  cart: CartItem[];
  email?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  shippingAddress?: UserAddressFields;
}

interface AuthErrors {
  [inputName: string]: string;
}

// need to add address
interface SignUpBody {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
}
interface SignInBody {
  email: string;
  password: string;
}

interface UserState {
  currentUser: CurrentUser;
  isLoggedIn: boolean;
  changeInCart: boolean;
  loadingStatus: string;
  authErrors: AuthErrors;
}

const initialState: UserState = {
  currentUser: { username: "", cart: [] },
  isLoggedIn: false,
  changeInCart: false,
  loadingStatus: "idle",
  authErrors: {},
};

const client = browserClient();
const serverUrl = "http://localhost:5000/api";

const getAuthStatus = createAsyncThunk("user/getAuthStatus", async () => {
  const response = await client.get<UserState>(serverUrl + "/auth/auth-status");

  return response.data;
});

const signIn = createAsyncThunk(
  "user/signIn",
  async (
    signInBody: SignInBody,
    // NOTE//
    // if you need to customize the contents of the rejected action, you should
    // catch any errors yourself, and then return a new value using the
    // thunkAPI.rejectWithValue
    { rejectWithValue }
  ) => {
    try {
      const response = await client.post(serverUrl + "/auth/sign-in", {
        email: signInBody.email,
        password: signInBody.password,
      });
      return response.data;
    } catch (err: any) {
      // catch the error sent from the server manually, and put in inside the action.payload
      return rejectWithValue(err.response.data);
    }
  }
);

const signOut = createAsyncThunk("user/signOut", async () => {
  await client.post(serverUrl + "/auth/sign-out");
  console.log("in redux --- signing out");
  return;
});

const signUp = createAsyncThunk(
  "user/signUp",
  async (signUpBody: SignUpBody, { rejectWithValue }) => {
    try {
      const response = await client.post(serverUrl + "/auth/sign-up", {
        email: signUpBody.email,
        password: signUpBody.password,
        confirm_password: signUpBody.confirm_password,
        first_name: signUpBody.first_name,
        last_name: signUpBody.last_name,
      });
      return response.data;
    } catch (err: any) {
      // catch the error sent from the server manually, and put in inside the action.payload
      return rejectWithValue(err.response.data);
    }
  }
);

const addToCartSession = createAsyncThunk(
  "user/addToCartSession",
  async ({
    item,
    editMode,
    index,
  }: {
    item: CartItem;
    editMode?: boolean;
    index?: number;
  }) => {
    const response = await client.post(serverUrl + "/shop/add-to-cart", {
      item,
      editMode,
      index,
    });

    console.log(response.data);
    return response.data;
  }
);

const removeFromCartSession = createAsyncThunk(
  "user/removeFromCartSession",
  async (index: number) => {
    const response = await client.post(serverUrl + "/shop/remove-from-cart", {
      index,
    });
    return response.data;
  }
);

const directChangeQty = createAsyncThunk(
  "user/directChangeQty",
  async ({ quantity, index }: { quantity: number; index: number }) => {
    const response = await client.post(serverUrl + "/shop/change-quantity", {
      quantity,
      index,
    });
    return response.data;
  }
);

const clearCartSession = createAsyncThunk("user/clearCartSession", async () => {
  const response = await client.post(serverUrl + "/shop/clear-cart");
  return response.data;
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
  },
  extraReducers: (builder) => {
    builder
      //////////////
      // GET AUTH //
      //////////////
      .addCase(
        getAuthStatus.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          // remember to add the state type as return type
          state.currentUser = action.payload.currentUser;
          state.isLoggedIn = action.payload.isLoggedIn;
          console.log("in redux getAuthStatus---------->", state.currentUser);
        }
      )
      /////////////
      // SIGN IN //
      /////////////
      .addCase(
        signIn.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
          state.isLoggedIn = action.payload.isLoggedIn;
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
        state.isLoggedIn = false;
        state.loadingStatus = "idle";
      })
      /////////////
      // SIGN UP //
      /////////////
      .addCase(
        signUp.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
          state.isLoggedIn = action.payload.isLoggedIn;
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
      );
  },
});

export const { clearAuthErrors, setChangeInCart } = userSlice.actions;
export {
  signIn,
  signOut,
  signUp,
  getAuthStatus,
  addToCartSession,
  directChangeQty,
  removeFromCartSession,
  clearCartSession,
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
  [selectUser],
  (userState) => userState.isLoggedIn
);
export const selectLoadingStatus = createSelector(
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
  return total;
});
