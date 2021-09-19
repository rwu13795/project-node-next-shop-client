import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

import browserClient from "../util/axios-client/browser-client";
import { inputNames } from "../util/enums/input-names";

interface CurrentUser {
  username: string;
  email?: string;
  userId?: string;
  cart?: Object[];
}

interface SignInErrors {
  [inputName: string]: string;
}

interface AuthState {
  currentUser: CurrentUser;
  isLoggedIn: boolean;
  signInErrors: SignInErrors;
}

const serverUrl = "http://localhost:5000/api/auth";

const initialState: AuthState = {
  currentUser: { username: "" },
  isLoggedIn: false,
  signInErrors: {
    [inputNames.email]: "",
    [inputNames.password]: "",
  },
};

const client = browserClient();

export const getAuthStatus = createAsyncThunk(
  "auth/getAuthStatus",
  async () => {
    const response = await client.get<AuthState>(serverUrl + "/auth-status");

    console.log("in redux getAuthStatus---------->", response.data);
    return response.data;
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    signInBody: { email: string; password: string },
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut(state, action) {
      state.isLoggedIn = false;
    },
    clearSignInErrors(state, action) {
      state.signInErrors[action.payload] = "";
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
      .addCase(
        signIn.fulfilled,
        (state, action: PayloadAction<AuthState>): void => {
          state.currentUser = action.payload.currentUser;
          state.isLoggedIn = action.payload.isLoggedIn;
        }
      )
      .addCase(signIn.rejected, (state, action: PayloadAction<any>): void => {
        console.log(action.payload);
        for (let err of action.payload.errors) {
          state.signInErrors[err.field] = err.message;
        }
      });
  },
});

export const { signOut, clearSignInErrors } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectErros = (state: RootState) => state.auth.signInErrors;
