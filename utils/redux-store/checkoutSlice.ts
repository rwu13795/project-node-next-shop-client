import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import browserClient from "../axios-client/browser-client";

import { inputNames } from "../enums-types/input-names";
import { InputValues } from "../helper-functions/input-error-check";
import { CurrentUser } from "./userSlice";

interface PaymentDetail {
  payment_processer: string;
  payment_method: string | null | undefined;
  payment_id: string | null | undefined;
  payment_status: string | null | undefined;
}

// have to use InputValue interface for all these states
// otherwise, I could map all these values dynamically using the
// [inputName]: inputValue (computed properties)
interface CheckoutState {
  shippingAddress: InputValues;
  billingAddress: InputValues;
  contactInfo: InputValues;
}

interface CreateOrderBody {
  currentUser: CurrentUser;
  totalAmount: number;
  paymentDetail: PaymentDetail;
}

export const addressFields = [
  inputNames.first_name,
  inputNames.last_name,
  inputNames.address_1,
  inputNames.address_2,
  inputNames.city,
  inputNames.state,
  inputNames.zip_code,
];

export const contactFields = [inputNames.email, inputNames.phone];

const client = browserClient();
const serverUrl = "http://localhost:5000/api";

const initializeValue = (inputFields: string[]) => {
  let initialValue: InputValues = {};
  for (let name of inputFields) {
    initialValue = { ...initialValue, [name]: "" };
  }
  return initialValue;
};

// need put "as CheckoutAddressInfo" behind the "initializeValue" function call
// to override the [name: string] computed property signatures
const initialShippingAddress = initializeValue(addressFields);
const initialBillingAddress = initializeValue(addressFields);
const initialContactInfo = initializeValue(contactFields);

const initialState: CheckoutState = {
  shippingAddress: initialShippingAddress,
  billingAddress: initialBillingAddress,
  contactInfo: initialContactInfo,
};

const createOrderHistory = createAsyncThunk<
  void,
  CreateOrderBody,
  { state: RootState }
>(
  "checkout/createOrderHistory",
  async ({ currentUser, totalAmount, paymentDetail }, thunkAPI) => {
    const state = thunkAPI.getState();

    const response = await client.post(
      serverUrl + "/shop/create-order-history",
      {
        currentUser,
        shippingAddress: state.checkout.shippingAddress,
        billingAddress: state.checkout.billingAddress,
        contactInfo: state.checkout.contactInfo,
        totalAmount,
        paymentDetail,
      }
    );

    console.log(response.data);
  }
);

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
    setShippingAsBilling(state, action: PayloadAction<InputValues>) {
      state.billingAddress = action.payload;
    },
    toggleBillingAddress(state, action: PayloadAction<boolean>) {
      if (action.payload === true) {
        state.billingAddress = state.shippingAddress;
      } else {
        state.billingAddress = initialBillingAddress;
      }
    },
    loadUserInfo(
      state,
      action: PayloadAction<{
        addressInfo: InputValues;
        contactInfo: InputValues;
      }>
    ) {
      state.shippingAddress = action.payload.addressInfo;
      state.billingAddress = action.payload.addressInfo;
      state.contactInfo = action.payload.contactInfo;
    },
    clearCheckoutInfo(state) {
      state.shippingAddress = initialShippingAddress;
      state.billingAddress = initialBillingAddress;
      state.contactInfo = initialContactInfo;
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
  toggleBillingAddress,
  loadUserInfo,
  clearCheckoutInfo,
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
