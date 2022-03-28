import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import browserClient from "../axios-client/browser-client";
import { inputNames } from "../enums-types/input-names";

interface ProductInfoState {
  [inputNames.main]: string;
  [inputNames.sub]: string;
  [inputNames.title]: string;
  [inputNames.desc]: string;
  [inputNames.price]: number;
  [fieldName: string]: string | number | undefined;
}

export interface ColorPropsState {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imageCount: number;
  imageFiles: (File | string)[];
  imageUrls: string[];
}

interface UploadErrors {
  [inputNames.main]: string;
  [inputNames.sub]: string;
  [inputNames.title]: string;
  [inputNames.desc]: string;
  [inputNames.price]: string;
  [inputNames.colorName]: string;
  [inputNames.colorCode]: string;
  [inputNames.imagesCount]: string;
  [inputNames.size]: string;
  [inputName: string]: string;
}

export interface AddProductState {
  productInfo: ProductInfoState;
  colorPropsList: ColorPropsState[];
  deletedImages: string[];
  uploadStatus: string;
  uploadErrors: UploadErrors;
  currentCats: { main_cat: string; sub_cat: string };
}

interface UploadParams {
  editMode: boolean;
  productId?: string;
}
interface ColorPropsForUpload {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imageCount: number;
  modifiedImages?: (string | File)[];
  modifiedIndex?: number[];
}

const initialProductInfo: ProductInfoState = {
  [inputNames.main]: "",
  [inputNames.sub]: "",
  [inputNames.title]: "",
  [inputNames.desc]: "",
  [inputNames.price]: NaN,
};
const initialColorProps: ColorPropsState = {
  colorName: "",
  colorCode: "",
  sizes: { small: NaN, medium: NaN, large: NaN },
  imageCount: 0,
  imageFiles: [],
  imageUrls: [],
};
const initialUploadErrors: UploadErrors = {
  [inputNames.main]: "",
  [inputNames.sub]: "",
  [inputNames.title]: "",
  [inputNames.desc]: "",
  [inputNames.price]: "",
  [inputNames.colorName]: "",
  [inputNames.colorCode]: "",
  [inputNames.imagesCount]: "",
  [inputNames.size]: "",
};

const initialState: AddProductState = {
  productInfo: initialProductInfo,
  colorPropsList: [initialColorProps],
  deletedImages: [],
  uploadStatus: "idle",
  uploadErrors: initialUploadErrors,
  currentCats: { main_cat: "", sub_cat: "" },
};

const client = browserClient();
const serverUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}`;

// createAsyncThunk<"PayloadAction type", "function param" , "ThunkApiConfig">
const uploadNewProduct = createAsyncThunk<
  { main_cat: string; sub_cat: string },
  UploadParams,
  { state: RootState }
>(
  "admin_product/uploadNewProduct",
  async ({ editMode, productId }, thunkAPI) => {
    const state = thunkAPI.getState().admin_product;
    const csrfToken = thunkAPI.getState().admin.csrfToken;
    // to make change in item of a specific admin as the Master Admin
    const selected_admin_username = thunkAPI.getState().admin.selectedAdmin;

    try {
      // becuase we cannot send the image files and the JSON object through one
      // single "req.body", we have to use the "FormData"
      // re-format the props and put the imageFiles into "formData", so that we
      // can combine the normal objects and images file into a singel "body", and
      // send them to the server in 1 post-request
      let colorPropsUpload: ColorPropsForUpload[] = [];

      const formData = new FormData();
      for (let elem of state.colorPropsList) {
        let modifiedIndex = [];
        let modifiedImages = [...elem.imageFiles];
        // seperate images Urls and images Files
        if (elem.imageFiles.length > 0) {
          for (let i = 0; i < elem.imageFiles.length; i++) {
            if (editMode) {
              if (typeof elem.imageFiles[i] !== "string") {
                formData.append("uploaded_images", elem.imageFiles[i]);
                modifiedImages[i] = "modified";
                modifiedIndex.push(i);
              }
            } else {
              formData.append("uploaded_images", elem.imageFiles[i]);
            }
          }
        }
        // we don't want to send the imageFiles again, so we create and send
        // a new array containing the colorProps
        if (editMode) {
          colorPropsUpload.push({
            colorName: elem.colorName,
            colorCode: elem.colorCode,
            sizes: { ...elem.sizes },
            imageCount: elem.imageCount,
            modifiedImages,
            modifiedIndex,
          });
        } else {
          colorPropsUpload.push({
            colorName: elem.colorName,
            colorCode: elem.colorCode,
            sizes: { ...elem.sizes },
            imageCount: elem.imageCount,
          });
        }
      }

      const body = {
        ...state.productInfo,
        colorPropsListFromClient: colorPropsUpload,
        deletedImgaes: state.deletedImages,
        productId,
        selected_admin_username,
        csrfToken,
      };

      // the "body" cannot be put inside "req.body" directly while using FormData,
      // this "body" has to be added to "req.body.propName", and we need to parse this
      // "req.body.document" in the server
      formData.append("document", JSON.stringify(body));

      const { data } = await client.post(
        editMode
          ? serverUrl + "/admin/edit-product"
          : serverUrl + "/admin/add-product",
        formData
      );

      return { main_cat: data.main_cat, sub_cat: data.sub_cat };
    } catch (err: any) {
      // catch the error sent from the server manually, and put it in inside the action.payload
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
const deleteProduct = createAsyncThunk<
  void,
  { productId: string; admin_username: string },
  { state: RootState }
>(
  "admin_product/deleteProduct",
  async ({ productId, admin_username }, thunkAPI) => {
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
  }
);
////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
const addProductSlice = createSlice({
  name: "admin_product",
  initialState,
  reducers: {
    setInitialState_adminProduct(
      state,
      action: PayloadAction<AddProductState>
    ) {
      const { productInfo, colorPropsList } = action.payload;
      state.productInfo = productInfo;
      state.colorPropsList = colorPropsList;
      // add the existing image Urls to the state's imageUrls
      for (let i = 0; i < colorPropsList.length; i++) {
        state.colorPropsList[i].imageUrls = colorPropsList[i]
          .imageFiles as string[];
      }
    },
    resetState_adminProduct(state) {
      state.colorPropsList = [{ ...initialColorProps }];
      state.productInfo = { ...initialProductInfo };
      state.deletedImages = [];
      state.uploadErrors = { ...initialUploadErrors };
    },
    setCurrentCats_adminProduct(
      state,
      action: PayloadAction<{ main: string; sub: string }>
    ) {
      state.currentCats.main_cat = action.payload.main.toLowerCase();
      state.currentCats.sub_cat = action.payload.sub.toLowerCase();
    },

    //////////////////
    // product info //
    setMainCat_adminProduct(state, action: PayloadAction<string>) {
      state.productInfo.main_cat = action.payload;
    },
    setSubCat_adminProduct(state, action: PayloadAction<string>) {
      state.productInfo.sub_cat = action.payload;
    },

    setTitle_adminProduct(state, action: PayloadAction<string>) {
      state.productInfo.title = action.payload;
    },
    setDesc_adminProduct(state, action: PayloadAction<string>) {
      state.productInfo.description = action.payload;
    },
    setPrice_adminProduct(state, action: PayloadAction<string>) {
      const price = parseFloat(parseFloat(action.payload).toFixed(2));
      state.productInfo.price = price;
    },

    //////////////////
    // colors props //
    addMoreColor_adminProduct(state) {
      state.colorPropsList.push(initialColorProps);
    },
    removeColor_adminProduct(
      state,
      action: PayloadAction<{ listIndex: number; editMode: boolean }>
    ) {
      const { listIndex, editMode } = action.payload;

      if (editMode) {
        const oldImageUrls = state.colorPropsList[listIndex]
          .imageFiles as string[];
        state.deletedImages.push(...oldImageUrls);
      }
      state.colorPropsList.splice(listIndex, 1);
      if (state.colorPropsList.length === 0) {
        state.colorPropsList.push(initialColorProps);
      }
    },
    setColorInfo_adminProduct(
      state,
      action: PayloadAction<{
        listIndex: number;
        name: string;
        value: string;
      }>
    ) {
      const { listIndex, name, value } = action.payload;
      if (name === "colorCode") {
        state.colorPropsList[listIndex].colorCode = value;
      } else {
        state.colorPropsList[listIndex].colorName = value;
      }
    },
    setSizeQty_adminProduct(
      state,
      action: PayloadAction<{ listIndex: number; qty: string; size: string }>
    ) {
      const { listIndex, qty, size } = action.payload;
      state.colorPropsList[listIndex].sizes[size] = parseInt(qty);
    },

    ////////////////////
    // image handlers //
    addImage_adminProduct(
      state,
      action: PayloadAction<{ listIndex: number; newImagesList: FileList }>
    ) {
      const { listIndex, newImagesList } = action.payload;

      if (newImagesList !== undefined) {
        let imageFilesArray = Array.from(newImagesList);
        state.colorPropsList[listIndex].imageFiles.push(...imageFilesArray);

        for (let file of imageFilesArray) {
          state.colorPropsList[listIndex].imageUrls.push(
            URL.createObjectURL(file)
          );
        }

        state.colorPropsList[listIndex].imageCount =
          state.colorPropsList[listIndex].imageFiles.length;
      }
    },
    removeImage_adminProduct(
      state,
      action: PayloadAction<{
        listIndex: number;
        imageIndex: number;
        editMode: boolean;
      }>
    ) {
      const { listIndex, imageIndex, editMode } = action.payload;
      const oldImage = state.colorPropsList[listIndex].imageFiles[imageIndex];

      if (editMode && typeof oldImage === "string") {
        state.deletedImages.push(oldImage);
      }
      state.colorPropsList[listIndex].imageFiles.splice(imageIndex, 1);
      state.colorPropsList[listIndex].imageUrls.splice(imageIndex, 1);
      state.colorPropsList[listIndex].imageCount -= 1;
    },
    replaceImage_adminProduct(
      state,
      action: PayloadAction<{
        newImageFile: File;
        listIndex: number;
        imageIndex: number;
        editMode: boolean;
      }>
    ) {
      const { newImageFile, listIndex, imageIndex, editMode } = action.payload;
      // user might click the "replace button" and then cancel, this will make the
      // input in the image file input field as "undefined"
      if (newImageFile !== undefined) {
        const oldImage = state.colorPropsList[listIndex].imageFiles[imageIndex];
        if (editMode && typeof oldImage === "string") {
          state.deletedImages.push(oldImage);
        }
        state.colorPropsList[listIndex].imageFiles[imageIndex] = newImageFile;
        state.colorPropsList[listIndex].imageUrls[imageIndex] =
          URL.createObjectURL(newImageFile);
      }
    },

    /////////////
    // upload  //
    clearUploadError_byInputName(state, action: PayloadAction<string>) {
      state.uploadErrors[action.payload] = "";
    },
    setUploadStatus_adminProduct(state, action: PayloadAction<string>) {
      state.uploadStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      ///////////////////////
      // UPLOAD NEW PRODUCT//
      .addCase(
        uploadNewProduct.fulfilled,
        (
          state,
          action: PayloadAction<{ main_cat: string; sub_cat: string }>
        ): void => {
          state.uploadStatus = "succeeded";
          state.currentCats.main_cat = action.payload.main_cat;
          state.currentCats.sub_cat = action.payload.sub_cat;
          state.colorPropsList = [{ ...initialColorProps }];
          state.productInfo = { ...initialProductInfo };
          state.deletedImages = [];
          state.uploadErrors = { ...initialUploadErrors };
        }
      )
      .addCase(uploadNewProduct.pending, (state): void => {
        state.uploadStatus = "loading";
      })
      .addCase(
        uploadNewProduct.rejected,
        (state, action: PayloadAction<any>): void => {
          state.uploadStatus = "failed";

          // catch the errors from the "request-validator"
          // the error messages array sent from the server is inside "err.response.data.errors"
          for (let e of action.payload.errors) {
            if (e.field !== "colorPropsListFromClient") {
              state.uploadErrors[e.field] = e.message;
            } else {
              if (e.message === inputNames.colorCode) {
                state.uploadErrors[inputNames.colorCode] =
                  "Please select a color";
              } else if (e.message === inputNames.colorName) {
                state.uploadErrors[inputNames.colorName] =
                  "Please select a name for the color";
              } else if (e.message === inputNames.size) {
                state.uploadErrors[inputNames.size] = "Invalid quantity";
              } else {
                state.uploadErrors[inputNames.imagesCount] =
                  "Please upload at least one image";
              }
            }
          }
        }
      )
      ////////////////////
      // DELETE PRODUCT //
      .addCase(deleteProduct.fulfilled, (state, action): void => {
        state.uploadStatus = "succeeded";
      })
      .addCase(
        deleteProduct.rejected,
        (state, action: PayloadAction<any>): void => {
          for (let err of action.payload.errors) {
            state.uploadErrors[err.field] = err.message;
          }
          state.uploadStatus = "failed";
        }
      );
  },
});

export const {
  setInitialState_adminProduct,
  resetState_adminProduct,
  setCurrentCats_adminProduct,
  // product info //
  setMainCat_adminProduct,
  setSubCat_adminProduct,
  setTitle_adminProduct,
  setDesc_adminProduct,
  setPrice_adminProduct,
  // colors props //
  addMoreColor_adminProduct,
  removeColor_adminProduct,
  setColorInfo_adminProduct,
  setSizeQty_adminProduct,
  // image handlers //
  addImage_adminProduct,
  removeImage_adminProduct,
  replaceImage_adminProduct,
  // upload //
  clearUploadError_byInputName,
  setUploadStatus_adminProduct,
} = addProductSlice.actions;

export { uploadNewProduct, deleteProduct };

export default addProductSlice.reducer;

// NOTE from Redux Docs //
// In typical Reselect usage, you write your top-level "input selectors" as plain functions,
// and use createSelector to create memoized selectors that look up nested value
const selectAdminProductState = (state: RootState) => state.admin_product;

const selectProductInfo = createSelector([selectAdminProductState], (state) => {
  return state.productInfo;
});
export const selectColorPropsList = createSelector(
  [selectAdminProductState],
  (state) => {
    return state.colorPropsList;
  }
);

// NOTE
// I could use createSelector and pass the "selectAdminProductState" as selector
// like [selectProductInfo] in the selectTitle_adminProduct below, to select
// the state of the "admin_product", no need to pass the the "state: RootState".
export const selectImageUrls_byListIndex = (
  state: RootState,
  listIndex: number
) => state.admin_product.colorPropsList[listIndex].imageUrls;

// select productInfo //
export const selectTitle_adminProduct = createSelector(
  [selectProductInfo],
  (state) => {
    return state.title;
  }
);
export const selectDesc_adminProduct = createSelector(
  [selectProductInfo],
  (state) => {
    return state.description;
  }
);
export const selectMainCat_adminProduct = createSelector(
  [selectProductInfo],
  (state) => {
    return state.main_cat;
  }
);
export const selectSubCat_adminProduct = createSelector(
  [selectProductInfo],
  (state) => {
    return state.sub_cat;
  }
);
export const selectPrice_adminProduct = createSelector(
  [selectProductInfo],
  (state) => {
    return state.price;
  }
);

// upload info //
export const selectUploadStatus_adminProduct = createSelector(
  [selectAdminProductState],
  (state) => {
    return state.uploadStatus;
  }
);
export const selectUploadErrors_adminProduct = createSelector(
  [selectAdminProductState],
  (state) => {
    return state.uploadErrors;
  }
);
export const selectUploadError_byInputName = (
  state: RootState,
  inputName: string
) => {
  return state.admin_product.uploadErrors[inputName];
};

export const selectCurrentCats_adminProduct = createSelector(
  [selectAdminProductState],
  (state) => {
    return state.currentCats;
  }
);
