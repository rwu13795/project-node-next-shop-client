import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { StripeCardElement } from "@stripe/stripe-js";
import { RootState } from ".";
import browserClient from "../axios-client/browser-client";

import { inputNames } from "../enums-types/input-names";
import { InputValue } from "../react-hooks/input-error-check";
import { CurrentUser } from "./userSlice";

interface CheckoutState {
  shippingAddress: InputValue;
  billingAddress: InputValue;
  contactInfo: InputValue;
}

export const addressFields = [
  inputNames.first_name,
  inputNames.last_name,
  inputNames.address_1,
  inputNames.address_2,
  inputNames.state,
  inputNames.city,
  inputNames.zip_code,
];

export const contactFields = [inputNames.email, inputNames.phone];

const client = browserClient();
const serverUrl = "http://localhost:5000/api";

const initializeValue = (inputFields: string[]) => {
  let initialValue: InputValue = {};
  for (let name of inputFields) {
    initialValue = { ...initialValue, [name]: "" };
  }
  return initialValue;
};

const shippingAddress = initializeValue(addressFields);
const billingAddress = initializeValue(addressFields);
const contactInfo = initializeValue(contactFields);

const initialState: CheckoutState = {
  shippingAddress,
  billingAddress,
  contactInfo,
};

const createOrderHistory = createAsyncThunk<
  void,
  CurrentUser,
  { state: RootState }
>("checkout/createOrderHistory", async (currentUser: CurrentUser, thunkAPI) => {
  const state = thunkAPI.getState();

  const response = await client.post(serverUrl + "/shop/create-order-history", {
    currentUser,
    shippingAddress: state.checkout.shippingAddress,
    billingAddress: state.checkout.billingAddress,
    contactInfo: state.checkout.contactInfo,
  });

  console.log(response.data);
});

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setContactInfo(
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) {
      state.contactInfo[action.payload.name] = action.payload.value;
    },
    setShippingAddress(
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) {
      state.shippingAddress[action.payload.name] = action.payload.value;
      state.billingAddress[action.payload.name] = action.payload.value;
    },
    setBillingAddress(
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) {
      state.billingAddress[action.payload.name] = action.payload.value;
    },
    setShippingAsBilling(state, action: PayloadAction<InputValue>) {
      state.billingAddress = action.payload;
    },
    clearBillingAddress(state, action: PayloadAction<boolean>) {
      if (action.payload === true) {
        state.billingAddress = state.shippingAddress;
      } else {
        state.billingAddress = billingAddress;
      }
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     //////////////
  //     // GET AUTH //
  //     //////////////
  //     .addCase(
  //       createOrderHistory.fulfilled,
  //       (state): void => {

  //       }
  //     );
  // },
});

export const {
  setContactInfo,
  setShippingAddress,
  setBillingAddress,
  setShippingAsBilling,
  clearBillingAddress,
} = checkoutSlice.actions;
export { createOrderHistory };

export default checkoutSlice.reducer;

const selectCheckout = (state: RootState) => state.checkout;

export const selectContactInfo = createSelector(
  [selectCheckout],
  (checkoutState) => checkoutState.contactInfo
);
export const selectShippingAddress = createSelector(
  [selectCheckout],
  (checkoutState) => checkoutState.shippingAddress
);
export const selectBillingAddress = createSelector(
  [selectCheckout],
  (checkoutState) => checkoutState.billingAddress
);
