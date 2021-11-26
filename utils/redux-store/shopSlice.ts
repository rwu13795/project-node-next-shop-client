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
interface ShopState {
  shippingAddress: InputValues;
  billingAddress: InputValues;
  contactInfo: InputValues;
  previewColorIndex: number;
  productFiltering: boolean;
  filterTagToClear: string;
  openFilterModal: boolean;
  oneItmePerRow: boolean;
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

const initialState: ShopState = {
  shippingAddress: initialShippingAddress,
  billingAddress: initialBillingAddress,
  contactInfo: initialContactInfo,
  previewColorIndex: -1,
  productFiltering: false,
  filterTagToClear: "",
  openFilterModal: false,
  oneItmePerRow: false,
};

const createOrderHistory = createAsyncThunk<
  void,
  CreateOrderBody,
  { state: RootState }
>(
  "shop/createOrderHistory",
  async ({ currentUser, totalAmount, paymentDetail }, thunkAPI) => {
    const state = thunkAPI.getState();

    const response = await client.post(
      serverUrl + "/shop/create-order-history",
      {
        currentUser,
        shippingAddress: state.shop.shippingAddress,
        billingAddress: state.shop.billingAddress,
        contactInfo: state.shop.contactInfo,
        totalAmount,
        paymentDetail,
      }
    );

    console.log(response.data);
  }
);

const shopSlice = createSlice({
  name: "shop",
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
    setPreviewColorIndex(state, action: PayloadAction<number>) {
      state.previewColorIndex = action.payload;
    },
    setProductFiltering(state, action: PayloadAction<boolean>) {
      state.productFiltering = action.payload;
    },
    setFilterTagToClear(state, action: PayloadAction<string>) {
      state.filterTagToClear = action.payload;
    },
    setOpenFilterModal(state, action: PayloadAction<boolean>) {
      state.openFilterModal = action.payload;
    },
    setOneItmePerRow(state) {
      state.oneItmePerRow = !state.oneItmePerRow;
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
  setPreviewColorIndex,
  setProductFiltering,
  setFilterTagToClear,
  setOpenFilterModal,
  setOneItmePerRow,
} = shopSlice.actions;
export { createOrderHistory };

export default shopSlice.reducer;

const selectCheckout = (state: RootState) => state.shop;

export const selectContactInfo = createSelector(
  [selectCheckout],
  (shopState) => shopState.contactInfo
);
export const selectShippingAddress = createSelector(
  [selectCheckout],
  (shopState) => shopState.shippingAddress
);
export const selectBillingAddress = createSelector(
  [selectCheckout],
  (shopState) => shopState.billingAddress
);
export const selectPreviewColorIndex = createSelector(
  [selectCheckout],
  (shopState) => shopState.previewColorIndex
);
export const selectProductFiltering = createSelector(
  [selectCheckout],
  (shopState) => shopState.productFiltering
);
export const selectFilterTagToClear = createSelector(
  [selectCheckout],
  (shopState) => shopState.filterTagToClear
);
export const selectOpenFilterModal = createSelector(
  [selectCheckout],
  (shopState) => shopState.openFilterModal
);
export const selectOneItmePerRow = createSelector(
  [selectCheckout],
  (shopState) => shopState.oneItmePerRow
);
