import produce from "immer";
import { inputNames } from "../enums-types/input-names";

import { Actions } from "../enums-types/product-reducer-actions";

export interface ReducerColorProps {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imageCount: number;
  imageFiles: (File | string)[];
}

export interface ReducerProductInfo {
  [fieldName: string]: string | number | undefined;
}

export interface ProductState {
  colorPropsList: ReducerColorProps[];
  productInfo: ReducerProductInfo;
  deletedImages?: string[];
}

export type ActionType =
  | {
      type: Actions.addInfo;
      payload: { inputField: string; inputValue: string };
    }
  | { type: Actions.addImage; payload: { listIndex: number; newImage: File } }
  | {
      type: Actions.replaceImage;
      payload: {
        listIndex: number;
        newImage: File;
        imageIndex: number;
        editMode: boolean;
      };
    }
  | {
      type: Actions.removeImage;
      payload: { listIndex: number; imageIndex: number; editMode: boolean };
    }
  | {
      type: Actions.addColorInfo;
      payload: { listIndex: number; inputField: string; inputValue: string };
    }
  | {
      type: Actions.addMoreColor;
      payload?: Object;
    }
  | {
      type: Actions.removeColor;
      payload: { listIndex: number; editMode: boolean };
    }
  | {
      type: Actions.addSizes;
      payload: { listIndex: number; inputField: string; inputValue: string };
    };

export const initialColorProps = {
  colorName: "",
  colorCode: "",
  sizes: { small: 0, medium: 0, large: 0 },
  imageCount: 0,
  imageFiles: [],
};

export const initialProductInfo = {
  [inputNames.main]: "",
  [inputNames.sub]: "",
  [inputNames.title]: "",
  [inputNames.price]: 0,
};

export default function addProductReducer(
  state: ProductState,
  action: ActionType
): ProductState {
  switch (action.type) {
    case Actions.addInfo: {
      const { inputField, inputValue } = action.payload;
      return produce(state, (newState) => {
        newState.productInfo[inputField] = inputValue;
      });
    }
    case Actions.addImage: {
      const { listIndex, newImage } = action.payload;
      return produce(state, (newState) => {
        if (newImage !== undefined) {
          newState.colorPropsList[listIndex].imageFiles.push(newImage);
          newState.colorPropsList[listIndex].imageCount =
            newState.colorPropsList[listIndex].imageFiles.length;
        }
      });
    }
    case Actions.replaceImage: {
      const { listIndex, newImage, imageIndex, editMode } = action.payload;
      return produce(state, (newState) => {
        if (newImage !== undefined) {
          let oldImage =
            newState.colorPropsList[listIndex].imageFiles[imageIndex];
          if (editMode && typeof oldImage === "string") {
            if (newState.deletedImages === undefined) {
              newState.deletedImages = [];
            }
            newState.deletedImages.push(oldImage);
          }
          newState.colorPropsList[listIndex].imageFiles[imageIndex] = newImage;
        }
      });
    }
    case Actions.removeImage: {
      const { listIndex, imageIndex, editMode } = action.payload;
      return produce(state, (newState) => {
        let oldImage =
          newState.colorPropsList[listIndex].imageFiles[imageIndex];
        if (editMode && typeof oldImage === "string") {
          if (newState.deletedImages === undefined) {
            newState.deletedImages = [];
          }
          newState.deletedImages.push(oldImage);
        }
        newState.colorPropsList[listIndex].imageFiles.splice(imageIndex, 1);
        newState.colorPropsList[listIndex].imageCount =
          newState.colorPropsList[listIndex].imageCount - 1;
      });
    }
    case Actions.addColorInfo: {
      const { listIndex, inputField, inputValue } = action.payload;
      if (inputField === "colorCode") {
        return produce(state, (newState) => {
          newState.colorPropsList[listIndex].colorCode = inputValue;
        });
      } else {
        return produce(state, (newState) => {
          newState.colorPropsList[listIndex].colorName = inputValue;
        });
      }
    }
    case Actions.addMoreColor: {
      return produce(state, (newState) => {
        newState.colorPropsList.push(initialColorProps);
      });
    }
    case Actions.removeColor: {
      const { listIndex, editMode } = action.payload;
      return produce(state, (newState) => {
        if (editMode) {
          let oldImageUrl = newState.colorPropsList[listIndex]
            .imageFiles as string[];
          if (newState.deletedImages === undefined) {
            newState.deletedImages = [];
          }
          newState.deletedImages.push(...oldImageUrl);
        }
        newState.colorPropsList.splice(listIndex, 1);
        if (newState.colorPropsList.length === 0) {
          newState.colorPropsList.push(initialColorProps);
        }
      });
    }
    case Actions.addSizes: {
      return produce(state, (newState) => {
        const { listIndex, inputField, inputValue } = action.payload;
        newState.colorPropsList[listIndex].sizes[inputField] =
          parseInt(inputValue);
      });
    }
    default: {
      throw new Error("You should not be here");
    }
  }
}
