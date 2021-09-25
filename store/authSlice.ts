import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

import browserClient from "../util/axios-client/browser-client";

interface CurrentUser {
  username: string;
  email?: string;
  userId?: string;
  cart?: [
    { imageUrl: string; productId: string; quantity: number; price: number }
  ];
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

interface AuthState {
  currentUser: CurrentUser;
  isLoggedIn: boolean;
  loadingStatus: string;
  authErrors: AuthErrors;
}

const serverUrl = "http://localhost:5000/api/auth";

const initialState: AuthState = {
  currentUser: { username: "" },
  isLoggedIn: false,
  loadingStatus: "idle",
  authErrors: {},
};

const client = browserClient();

const getAuthStatus = createAsyncThunk("auth/getAuthStatus", async () => {
  const response = await client.get<AuthState>(serverUrl + "/auth-status");

  console.log("in redux getAuthStatus---------->", response.data);
  return response.data;
});

const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    signInBody: SignInBody,
    // NOTE//
    // if you need to customize the contents of the rejected action, you should
    // catch any errors yourself, and then return a new value using the
    // thunkAPI.rejectWithValue
    { rejectWithValue }
  ) => {
    try {
      const response = await client.post(serverUrl + "/sign-in", {
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

const signOut = createAsyncThunk("auth/signOut", async () => {
  await client.post(serverUrl + "/sign-out");
  console.log("in redux --- signing out");
  return;
});

const signUp = createAsyncThunk(
  "auth/signUp",
  async (signUpBody: SignUpBody, { rejectWithValue }) => {
    try {
      const response = await client.post(serverUrl + "/sign-up", {
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthErrors(state, action) {
      state.authErrors[action.payload] = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getAuthStatus.fulfilled,
        (state, action: PayloadAction<AuthState>): void => {
          // remember to add the state type as return type
          state.currentUser = action.payload.currentUser;
          state.isLoggedIn = action.payload.isLoggedIn;
        }
      )
      /////////////
      // SIGN IN //
      /////////////
      .addCase(
        signIn.fulfilled,
        (state, action: PayloadAction<AuthState>): void => {
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
        (state, action: PayloadAction<AuthState>): void => {
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
      });
  },
});

export const { clearAuthErrors } = authSlice.actions;
export { signIn, signOut, signUp, getAuthStatus };

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectLoadingStatus = (state: RootState) =>
  state.auth.loadingStatus;
export const selectAuthErrors = (state: RootState) => state.auth.authErrors;
export const selectCart = (state: RootState) =>
  state.auth.currentUser.cart ? state.auth.currentUser.cart : [];
