import {
  Action,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";

import browserClient from "../axios-client/browser-client";

interface CartItem {
  imageUrl: string;
  title: string;
  main_cat: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  colorName: string;
}

interface CurrentUser {
  username: string;
  cart: CartItem[];
  email?: string;
  userId?: string;
}

interface AuthErrors {
  [inputName: string]: string;
}

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

const serverUrl = "http://localhost:5000/api";

const initialState: UserState = {
  currentUser: { username: "", cart: [] },
  isLoggedIn: false,
  changeInCart: false,
  loadingStatus: "idle",
  authErrors: {},
};

const client = browserClient();

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
  async (cart: CartItem[]) => {
    const response = await client.post(serverUrl + "/shop/remove-from-cart");
    return;
  }
);

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
          console.log(state.currentUser.cart);
        }
      );
  },
});

export const { clearAuthErrors, setChangeInCart } = userSlice.actions;
export { signIn, signOut, signUp, getAuthStatus, addToCartSession };

export default userSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectLoadingStatus = (state: RootState) =>
  state.user.loadingStatus;
export const selectAuthErrors = (state: RootState) => state.user.authErrors;
export const selectCart = (state: RootState) => state.user.currentUser.cart;
export const selectChangeInCart = (state: RootState) => state.user.changeInCart;
