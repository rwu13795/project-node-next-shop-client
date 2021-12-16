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
};

const client = browserClient();

// createAsyncThunk<"PayloadAction type", "function param" , "ThunkApiConfig">
const uploadNewProduct = createAsyncThunk<
  void,
  UploadParams,
  { state: RootState }
>("add_product/uploadNewProduct", async ({ editMode, productId }, thunkAPI) => {
  const state = thunkAPI.getState().add_product;
  const csrfToken = thunkAPI.getState().admin.csrfToken;
  const admin_username = thunkAPI.getState().admin.adminUser.admin_username;

  try {
    // re-format the props and put the imageFiles into "formData"
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
      admin_username,
      csrfToken,
    };

    // the "body" cannot be put inside "req.body" directly while using FormData,
    // this "body" has to be added to "req.body.propName", and we need to parse this
    // "req.body.document" in the server
    formData.append("document", JSON.stringify(body));

    await client.post(
      editMode
        ? "http://localhost:5000/api/admin/edit-product"
        : "http://localhost:5000/api/admin/add-product",
      formData
    );

    return;
  } catch (err: any) {
    // catch the error sent from the server manually, and put it in inside the action.payload
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

const addProductSlice = createSlice({
  name: "add_product",
  initialState,
  reducers: {
    setInitialState_addProduct(state, action: PayloadAction<AddProductState>) {
      const { productInfo, colorPropsList } = action.payload;
      state.productInfo = productInfo;
      state.colorPropsList = colorPropsList;
      // add the existing image Urls to the state's imageUrls
      for (let i = 0; i < colorPropsList.length; i++) {
        state.colorPropsList[i].imageUrls = colorPropsList[i]
          .imageFiles as string[];
      }
    },
    resetState_addProduct(state) {
      state.colorPropsList = [{ ...initialColorProps }];
      state.productInfo = { ...initialProductInfo };
      state.deletedImages = [];
      state.uploadErrors = { ...initialUploadErrors };
    },

    //////////////////
    // product info //
    setMainCat_addProduct(state, action: PayloadAction<string>) {
      state.productInfo.main_cat = action.payload;
    },
    setSubCat_addProduct(state, action: PayloadAction<string>) {
      state.productInfo.sub_cat = action.payload;
    },

    setTitle_addProduct(state, action: PayloadAction<string>) {
      state.productInfo.title = action.payload;
    },
    setDesc_addProduct(state, action: PayloadAction<string>) {
      state.productInfo.description = action.payload;
    },
    setPrice_addProduct(state, action: PayloadAction<number>) {
      state.productInfo.price = action.payload;
    },

    //////////////////
    // colors props //
    addMoreColor_addProduct(state) {
      state.colorPropsList.push(initialColorProps);
    },
    removeColor_addProduct(
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
    setColorInfo_addProduct(
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
    setSizeQty_addProduct(
      state,
      action: PayloadAction<{ listIndex: number; qty: string; size: string }>
    ) {
      const { listIndex, qty, size } = action.payload;
      state.colorPropsList[listIndex].sizes[size] = parseInt(qty);
    },

    ////////////////////
    // image handlers //
    addImage_addProduct(
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
    removeImage_addProduct(
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
    replaceImage_addProduct(
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
    setUploadStatus_addProduct(state, action: PayloadAction<string>) {
      state.uploadStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      ///////////////////////
      // UPLOAD NEW PRODUCT//
      .addCase(uploadNewProduct.fulfilled, (state): void => {
        state.uploadStatus = "succeeded";
        state.colorPropsList = [{ ...initialColorProps }];
        state.productInfo = { ...initialProductInfo };
        state.deletedImages = [];
        state.uploadErrors = { ...initialUploadErrors };
      })
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
      );
  },
});

export const {
  setInitialState_addProduct,
  resetState_addProduct,
  // product info //
  setMainCat_addProduct,
  setSubCat_addProduct,
  setTitle_addProduct,
  setDesc_addProduct,
  setPrice_addProduct,
  // colors props //
  addMoreColor_addProduct,
  removeColor_addProduct,
  setColorInfo_addProduct,
  setSizeQty_addProduct,
  // image handlers //
  addImage_addProduct,
  removeImage_addProduct,
  replaceImage_addProduct,
  // upload //
  clearUploadError_byInputName,
  setUploadStatus_addProduct,
} = addProductSlice.actions;

export { uploadNewProduct };

export default addProductSlice.reducer;

// NOTE from Redux Docs //
// In typical Reselect usage, you write your top-level "input selectors" as plain functions,
// and use createSelector to create memoized selectors that look up nested value
const selectAddProductState = (state: RootState) => state.add_product;

const selectProductInfo = createSelector([selectAddProductState], (state) => {
  return state.productInfo;
});
export const selectColorPropsList = createSelector(
  [selectAddProductState],
  (state) => {
    return state.colorPropsList;
  }
);
export const selectImageUrls_byListIndex = (
  state: RootState,
  listIndex: number
) => state.add_product.colorPropsList[listIndex].imageUrls;
// select productInfo //
export const selectTitle_addProduct = createSelector(
  [selectProductInfo],
  (state) => {
    return state.title;
  }
);
export const selectDesc_addProduct = createSelector(
  [selectProductInfo],
  (state) => {
    return state.description;
  }
);
export const selectMainCat_addProduct = createSelector(
  [selectProductInfo],
  (state) => {
    return state.main_cat;
  }
);
export const selectSubCat_addProduct = createSelector(
  [selectProductInfo],
  (state) => {
    return state.sub_cat;
  }
);
export const selectPrice_addProduct = createSelector(
  [selectProductInfo],
  (state) => {
    return state.price;
  }
);

export const selectUploadStatus_addProduct = createSelector(
  [selectAddProductState],
  (state) => {
    return state.uploadStatus;
  }
);
export const selectUploadErrors_addProduct = createSelector(
  [selectAddProductState],
  (state) => {
    return state.uploadErrors;
  }
);
export const selectUploadError_byInputName = (
  state: RootState,
  inputName: string
) => {
  return state.add_product.uploadErrors[inputName];
};
