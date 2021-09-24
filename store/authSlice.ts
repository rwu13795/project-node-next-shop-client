import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

import browserClient from "../util/axios-client/browser-client";

interface CurrentUser {
  username: string;
  email?: string;
  userId?: string;
  cart?: Object[];
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
  signUpStatus: string;
  signInErrors: AuthErrors;
  signUpErrors: AuthErrors;
}

const serverUrl = "http://localhost:5000/api/auth";

const initialState: AuthState = {
  currentUser: { username: "" },
  isLoggedIn: false,
  signUpStatus: "pending",
  signInErrors: {},
  signUpErrors: {},
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
    clearSignInErrors(state, action) {
      state.signInErrors[action.payload] = "";
    },
    clearSignUpErrors(state, action) {
      state.signUpErrors[action.payload] = "";
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
        //////////
        console.log(action.payload);
        //////////
        for (let err of action.payload.errors) {
          state.signInErrors[err.field] = err.message;
        }
      })
      .addCase(signOut.fulfilled, (state, action): void => {
        state.isLoggedIn = false;
      })
      .addCase(
        signUp.fulfilled,
        (state, action: PayloadAction<AuthState>): void => {
          state.currentUser = action.payload.currentUser;
          state.isLoggedIn = action.payload.isLoggedIn;
          state.signUpStatus = "succeeded";
        }
      )
      .addCase(signUp.rejected, (state, action: PayloadAction<any>): void => {
        ////////
        console.log(action.payload);
        ////////
        for (let err of action.payload.errors) {
          state.signUpErrors[err.field] = err.message;
        }
      });
  },
});

export const { clearSignInErrors, clearSignUpErrors } = authSlice.actions;
export { signIn, signOut, signUp, getAuthStatus };

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectSignUpStatus = (state: RootState) => state.auth.signUpStatus;
export const selectSignInErrors = (state: RootState) => state.auth.signInErrors;
export const selectSignUpErrors = (state: RootState) => state.auth.signUpErrors;
