import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useReducer, ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import useUpload from "../../util/react-hooks/add-product-upload";
import SelectCategory from "../../components/add-product/select-category";
import AddTitle from "../../components/add-product/add-title";
import AddPrice from "../../components/add-product/add-price";
import AddDescription from "../../components/add-product/add-description";
import AddColorsProps from "../../components/add-product/add-color-props";
import addProductReducer, {
  initialColorProps,
  initialProductInfo,
  ProductState,
} from "../../util/react-hooks/add-product-reducer";
import { Actions } from "../../util/enums/reducer-actions";

const initialProductState: ProductState = {
  colorPropsList: [initialColorProps],
  productInfo: initialProductInfo,
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
  const { postUpload, errors } = useUpload({
    colorPropsList: state.colorPropsList,
    productInfo: state.productInfo,
    onSuccess: () => {
      console.log("OK");
      // router.push("/");
      // console.log(productPropList);
    },
  });

  const uploadHandler = async () => {
    await postUpload();
  };

  return (
    <main>
      <h1>Add New Product</h1>
      <div>
        <label>Category: </label>
        <SelectCategory
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
          propError={errors}
        />
      </div>
      <div>
        <AddTitle
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
          propError={errors}
        />
      </div>
      <div>
        <AddPrice
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
        />
      </div>
      <div>
        <AddDescription
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
          propError={errors}
        />
      </div>
      {state.colorPropsList.map((prop, index) => {
        return (
          <AddColorsProps
            key={index}
            colorProps={prop}
            listIndex={index}
            dispatch={dispatch}
            propError={errors}
          />
        );
      })}
      <button
        onClick={() => {
          dispatch({ type: Actions.addMoreColor });
        }}
      >
        Add more colors
      </button>

      <div>
        <button onClick={uploadHandler}>upload</button>
      </div>
    </main>
  );
};

export default AddProduct;
