import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useState, useReducer, ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import useUpload from "../../util/react-hooks/add-product-upload";
import SelectCategory from "../../components/add-product/select-category";
import AddTitle from "../../components/add-product/add-title";
import AddPrice from "../../components/add-product/add-price";
import AddDescription from "../../components/add-product/add-description";
import AddColorsProps from "../../components/add-product/add-color-props";
import { FieldNames } from "../../util/enums/input-field-names";
import addProductReducer, {
  ProductState,
} from "../../util/react-hooks/add-product-reducer";
import { Actions } from "../../util/enums/reducer-actions";

const initialProductState: ProductState = {
  colorPropsList: [
    {
      colorName: "",
      colorCode: "",
      sizes: { small: 0, medium: 0, large: 0 },
      imagesCount: 0,
      imagesFiles: [],
    },
  ],
  productInfo: {
    [FieldNames.main]: "",
    [FieldNames.sub]: "",
    [FieldNames.title]: "",
    [FieldNames.price]: 0,
  },
};

export type AddInfoEvents =
  | ChangeEvent<HTMLInputElement>
  | SelectChangeEvent<string>
  | ChangeEvent<HTMLTextAreaElement>;

const AddProduct: NextPage = ({}) => {
  const router = useRouter();

  const [state, dispatch] = useReducer(addProductReducer, initialProductState);

  const dispatchAddInfo = (e: AddInfoEvents) => {
    const inputValue = e.target.value;
    const inputField = e.target.name;
    dispatch({
      type: Actions.addInfo,
      payload: { inputField, inputValue },
    });
  };

  // useUpload hook
  // const { postUpload, errors } = useUpload({
  //   productInfo,
  //   productPropList,
  //   onSuccess: () => {
  //     console.log("OK");
  //     // router.push("/");
  //     // console.log(productPropList);
  //   },
  // });

  // const uploadHandler = async () => {
  //   await postUpload();
  // };

  console.log(state);
  // console.log(productPropList);

  return (
    <main>
      <h1>Add New Product</h1>
      <div>
        <label>Category: </label>
        <SelectCategory
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
          // propError={errors}
        />
      </div>
      <div>
        <AddTitle
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
          // propError={errors}
        />
      </div>
      <div>
        <AddPrice
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
          // propError={errors}
        />
      </div>
      <div>
        <AddDescription
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
          // propError={errors}
        />
      </div>
      {state.colorPropsList.map((prop, index) => {
        return (
          <AddColorsProps
            key={index}
            colorProps={prop}
            listIndex={index}
            dispatch={dispatch}
            // propError={errors}
          />
        );
      })}
      {/* <button onClick={addMoreColorHandler}>Add more colors</button> */}

      {/* <div>
        <button onClick={uploadHandler}>upload</button>
      </div> */}
    </main>
  );
};

export default AddProduct;
