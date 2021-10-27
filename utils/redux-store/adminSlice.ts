import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from ".";

import browserClient from "../axios-client/browser-client";

interface SignUpBody {
  admin_username: string;
  password: string;
  confirm_password: string;
}
interface SignInBody {
  admin_username: string;
  password: string;
}

export interface AdminErrors {
  [inputName: string]: string;
}

interface AdminUser {
  admin_username: string;
  admin_id: string;
  loggedInAsAdmin?: boolean;
}

interface AdminState {
  adminUser: AdminUser;
  adminErrors: AdminErrors;
  loadingStatus: string;
  csrfToken: string;
}

const initialState: AdminState = {
  adminUser: { admin_username: "", admin_id: "" },
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
    1;
    const response = await client.post(serverUrl + "/admin/admin-sign-in", {
      admin_username: signInBody.admin_username,
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
});

const adminRegister = createAsyncThunk<
  AdminState,
  SignUpBody,
  { state: RootState }
>("admin/adminRegister", async (signUpBody, thunkAPI) => {
  try {
    const response = await client.post(serverUrl + "/admin/admin-register", {
      admin_username: signUpBody.admin_username,
      password: signUpBody.password,
      confirm_password: signUpBody.confirm_password,
    });
    return response.data;
  } catch (err: any) {
    // catch the error sent from the server manually, and put in inside the action.payload
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

const deleteProduct = createAsyncThunk<
  void,
  { productId: string; admin_username: string },
  { state: RootState }
>("admin/deleteProduct", async ({ productId, admin_username }, thunkAPI) => {
  try {
    const response = await client.post(serverUrl + "/admin/delete-product", {
      productId,
      csrfToken: thunkAPI.getState().admin.csrfToken,
      admin_username,
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
      if (action.payload === "all") {
        state.adminErrors = {};
      } else {
        state.adminErrors[action.payload] = "";
      }
    },
    setLoadingStatus_admin(state, action: PayloadAction<string>) {
      state.loadingStatus = action.payload;
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
          state.csrfToken = action.payload.csrfToken;
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
          state.csrfToken = action.payload.csrfToken;
          state.loadingStatus = "idle";
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
        state.adminUser.admin_id = "";
        state.adminUser.admin_username = "";
        state.adminUser.loggedInAsAdmin = false;
        state.csrfToken = "";
      })
      /////////////
      // SIGN UP //
      /////////////
      .addCase(
        adminRegister.fulfilled,
        (state, action: PayloadAction<AdminState>): void => {
          state.adminUser = action.payload.adminUser;
          state.loadingStatus = "idle";
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
      )
      ////////////////////
      // DELETE PRODUCT //
      ////////////////////
      .addCase(deleteProduct.fulfilled, (state, action): void => {
        state.loadingStatus = "succeeded";
      })
      .addCase(
        deleteProduct.rejected,
        (state, action: PayloadAction<any>): void => {
          for (let err of action.payload.errors) {
            state.adminErrors[err.field] = err.message;
            console.log(err.message);
          }
          state.loadingStatus = "idle";
        }
      );
  },
});
export const { clearAdminErrors, setLoadingStatus_admin } = adminSlice.actions;

export {
  adminSignIn,
  adminSignOut,
  adminRegister,
  getAdminStatus,
  deleteProduct,
};

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
export const selectLoggedInAsAdmin = createSelector(
  [selectAdminUser],
  (adminUser) => adminUser.loggedInAsAdmin
);
export const selectCsrfToken_admin = createSelector(
  [selectAdmin],
  (adminState) => adminState.csrfToken
);
