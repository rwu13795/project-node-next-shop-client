import produce from "immer";
import { FieldNames } from "../enums/input-field-names";

import { Actions } from "../enums/reducer-actions";

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
      type: Actions.addMoreColor;
      payload?: Object;
    }
  | {
      type: Actions.removeColor;
      payload: { listIndex: number };
    }
  | {
      type: Actions.addSizes;
      payload: { listIndex: number; inputField: string; inputValue: string };
    };

export const initialColorProps = {
  colorName: "",
  colorCode: "",
  sizes: { small: 0, medium: 0, large: 0 },
  imagesCount: 0,
  imagesFiles: [],
};

export const initialProductInfo = {
  [FieldNames.main]: "",
  [FieldNames.sub]: "",
  [FieldNames.title]: "",
  [FieldNames.price]: 0,
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
        newState.colorPropsList[listIndex].imagesFiles.push(newImage);
        newState.colorPropsList[listIndex].imagesCount =
          newState.colorPropsList[listIndex].imagesFiles.length;
      });
    }
    case Actions.replaceImage: {
      const { listIndex, newImage, imageIndex } = action.payload;
      return produce(state, (newState) => {
        newState.colorPropsList[listIndex].imagesFiles[imageIndex] = newImage;
      });
    }
    case Actions.removeImage: {
      const { listIndex, imageIndex } = action.payload;
      return produce(state, (newState) => {
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
    case Actions.addMoreColor: {
      return produce(state, (newState) => {
        newState.colorPropsList.push(initialColorProps);
      });
    }
    case Actions.removeColor: {
      const { listIndex } = action.payload;
      return produce(state, (newState) => {
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
      console.log("hello");
      throw new Error("You should not be here");
    }
  }
}
