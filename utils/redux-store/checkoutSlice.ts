import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

import { inputNames } from "../enums-types/input-names";
import { InputValue } from "../react-hooks/input-error-check";

interface CheckoutState {
  addressInfo: InputValue;
}

export const addressFields = [
  inputNames.email,
  inputNames.first_name,
  inputNames.last_name,
  inputNames.address_1,
  inputNames.address_2,
  inputNames.state,
  inputNames.city,
  inputNames.zip_code,
  inputNames.phone,
];

const initializeValue = (inputFields: string[]) => {
  let initialValue: InputValue = {};
  for (let name of inputFields) {
    initialValue = { ...initialValue, [name]: "" };
  }
  return initialValue;
};

const addressInfo = initializeValue(addressFields);

const initialState: CheckoutState = {
  addressInfo,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setAddressInfo(
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) {
      state.addressInfo[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   //////////////
    //   // GET AUTH //
    //   //////////////
    //   .addCase(
    //     getAuthStatus.fulfilled,
    //     (state, action: PayloadAction<UserState>): void => {
    //       // remember to add the state type as return type
    //       state.currentUser = action.payload.currentUser;
    //       state.isLoggedIn = action.payload.isLoggedIn;
    //       console.log("in redux getAuthStatus---------->", state.currentUser);
    //     }
    //   );
  },
});

export const { setAddressInfo } = checkoutSlice.actions;
export {};

export default checkoutSlice.reducer;

const selectCheckout = (state: RootState) => state.checkout;

export const selectAddressInfo = createSelector(
  [selectCheckout],
  (checkoutState) => checkoutState.addressInfo
);
