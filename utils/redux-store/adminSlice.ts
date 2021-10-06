import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from ".";

import browserClient from "../axios-client/browser-client";

interface SignUpBody {
  admin_id: string;
  password: string;
  confirm_password: string;
}
interface SignInBody {
  admin_id: string;
  password: string;
}

export interface AdminErrors {
  [inputName: string]: string;
}

interface AdminUser {
  admin_id: string;
  loggedInAsAdmin: boolean;
  _id: string;
}

interface AdminState {
  adminUser: AdminUser;
  adminErrors: AdminErrors;
  loadingStatus: string;
  csrfToken: string;
}

const initialState: AdminState = {
  adminUser: { admin_id: "", loggedInAsAdmin: false, _id: "" },
  adminErrors: {},
  loadingStatus: "idle",
  csrfToken: "",
};

const client = browserClient();
const serverUrl = "http://localhost:5000/api";

const getAdminStatus = createAsyncThunk("admin/getAdminStatus", async () => {
  const response = await client.get(serverUrl + "/admin/admin-status");

  return response.data;
});

const adminSignIn = createAsyncThunk<
  AdminState,
  SignInBody,
  { state: RootState }
>("admin/adminSignIn", async (signInBody, thunkAPI) => {
  try {
    console.log("adminSignIn in slice");
    const response = await client.post(serverUrl + "/admin/admin-sign-in", {
      admin_id: signInBody.admin_id,
      password: signInBody.password,
    });
    return response.data;
  } catch (err: any) {
    // catch the error sent from the server manually, and put in inside the action.payload
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

const adminSignOut = createAsyncThunk("admin/adminSignOut", async () => {
  await client.post(serverUrl + "/admin/admin-sign-out");
  console.log("in redux --- signing out");
  return;
});

const adminRegister = createAsyncThunk<
  AdminState,
  SignUpBody,
  { state: RootState }
>("admin/adminRegister", async (signUpBody, thunkAPI) => {
  try {
    const response = await client.post(serverUrl + "/admin/admin-register", {
      admin_id: signUpBody.admin_id,
      password: signUpBody.password,
      confirm_password: signUpBody.confirm_password,
    });
    return response.data;
  } catch (err: any) {
    // catch the error sent from the server manually, and put in inside the action.payload
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminErrors(state, action: PayloadAction<string>) {
      state.adminErrors[action.payload] = "";
    },
  },
  extraReducers: (builder) => {
    builder
      ////////////////
      // GET STATUS //
      ////////////////
      .addCase(
        getAdminStatus.fulfilled,
        (state, action: PayloadAction<AdminState>): void => {
          state.adminUser = action.payload.adminUser;

          console.log("in redux getAdminStatus---------->", state.adminUser);
        }
      )
      /////////////
      // SIGN IN //
      /////////////
      .addCase(
        adminSignIn.fulfilled,
        (state, action: PayloadAction<AdminState>): void => {
          state.adminUser = action.payload.adminUser;
          state.loadingStatus = "succeeded";
        }
      )
      .addCase(adminSignIn.pending, (state, action): void => {
        state.loadingStatus = "loading";
      })
      .addCase(
        adminSignIn.rejected,
        (state, action: PayloadAction<any>): void => {
          for (let err of action.payload.errors) {
            state.adminErrors[err.field] = err.message;
          }
          state.loadingStatus = "idle";
        }
      )
      //////////////
      // SIGN OUT //
      //////////////
      .addCase(adminSignOut.fulfilled, (state, action): void => {
        state = initialState;
      })
      /////////////
      // SIGN UP //
      /////////////
      .addCase(
        adminRegister.fulfilled,
        (state, action: PayloadAction<AdminState>): void => {
          state.adminUser = action.payload.adminUser;
          state.loadingStatus = "succeeded";
        }
      )
      .addCase(adminRegister.pending, (state, action): void => {
        state.loadingStatus = "loading";
      })
      .addCase(
        adminRegister.rejected,
        (state, action: PayloadAction<any>): void => {
          for (let err of action.payload.errors) {
            state.adminErrors[err.field] = err.message;
          }
          state.loadingStatus = "idle";
        }
      );
  },
});
export const { clearAdminErrors } = adminSlice.actions;

export { adminSignIn, adminSignOut, adminRegister, getAdminStatus };

export default adminSlice.reducer;

const selectAdmin = (state: RootState) => state.admin;

export const selectLoadingStatus_admin = createSelector(
  [selectAdmin],
  (adminState) => adminState.loadingStatus
);
export const selectAdminErrors = createSelector(
  [selectAdmin],
  (adminState) => adminState.adminErrors
);
export const selectAdminUser = createSelector(
  [selectAdmin],
  (adminState) => adminState.adminUser
);
