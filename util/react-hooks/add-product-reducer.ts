import produce from "immer";

import { Actions } from "../enums/reducer-actions";

export type ActionType =
  | {
      type: Actions.addInfo;
      payload: { inputField: string; inputValue: string };
    }
  | { type: Actions.addImage; payload: { listIndex: number; newImage: File } }
  | {
      type: Actions.replaceImage;
      payload: { listIndex: number; newImage: File; imageIndex: number };
    }
  | {
      type: Actions.removeImage;
      payload: { listIndex: number; imageIndex: number };
    }
  | {
      type: Actions.addColorInfo;
      payload: { listIndex: number; inputField: string; inputValue: string };
    }
  | {
      type: Actions.addSizes;
      payload: { listIndex: number; inputField: string; inputValue: string };
    };

export interface ColorProps {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imagesCount: number;
  imagesFiles: File[];
}

export interface ProductInfo {
  [fieldName: string]: string | number | undefined;
}

export interface ProductState {
  colorPropsList: ColorProps[];
  productInfo: ProductInfo;
}

export default function addProductReducer(
  state: ProductState,
  action: ActionType
): ProductState {
  switch (action.type) {
    case Actions.addInfo: {
      return produce(state, (newState) => {
        const { inputField, inputValue } = action.payload;
        newState.productInfo[inputField] = inputValue;
      });
    }
    case Actions.addImage: {
      return produce(state, (newState) => {
        const { listIndex, newImage } = action.payload;
        newState.colorPropsList[listIndex].imagesFiles.push(newImage);
        newState.colorPropsList[listIndex].imagesCount =
          newState.colorPropsList[listIndex].imagesFiles.length;
      });
    }
    case Actions.replaceImage: {
      return produce(state, (newState) => {
        const { listIndex, newImage, imageIndex } = action.payload;
        newState.colorPropsList[listIndex].imagesFiles[imageIndex] = newImage;
      });
    }
    case Actions.removeImage: {
      return produce(state, (newState) => {
        const { listIndex, imageIndex } = action.payload;
        newState.colorPropsList[listIndex].imagesFiles.splice(imageIndex, 1);
        newState.colorPropsList[listIndex].imagesCount =
          newState.colorPropsList[listIndex].imagesCount - 1;
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
    case Actions.addSizes: {
      return produce(state, (newState) => {
        const { listIndex, inputField, inputValue } = action.payload;
        newState.colorPropsList[listIndex].sizes[inputField] =
          parseInt(inputValue);
      });
    }
    default: {
      console.log("hello");
      throw new Error("You should not be here");
    }
  }
}
