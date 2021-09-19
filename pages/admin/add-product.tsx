import type { GetServerSidePropsContext, NextPage } from "next";
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
import { Actions } from "../../util/enums/product-reducer-actions";
import serverClient from "../../util/axios-client/server-client";

const initialProductState: ProductState = {
  colorPropsList: [initialColorProps],
  productInfo: initialProductInfo,
};

export type AddInfoEvents =
  | ChangeEvent<HTMLInputElement>
  | SelectChangeEvent<string>
  | ChangeEvent<HTMLTextAreaElement>;

interface PageProps {
  productId: string;
  product: ProductState;
  editMode: boolean;
  // csrfToken: string
}

const AddProduct: NextPage<PageProps> = ({ productId, product, editMode }) => {
  const router = useRouter();

  const [state, dispatch] = useReducer(
    addProductReducer,
    product ? product : initialProductState
  );

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
    editMode,
    deletedImgaes: state.deletedImages,
    productId,
    onSuccess: () => {
      console.log("OK");
      // router.push("/");
      // console.log(productPropList);
    },
  });

  const uploadHandler = async () => {
    await postUpload();
  };

  //////////////////////////
  console.log(state);

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
            editMode={editMode}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const { productId, category } = context.query;
  const client = serverClient(context);

  const productId = "614565ea548d3ea1dc2298be";
  const category = "Women";

  if (!productId) {
    return {
      props: {},
    };
  }

  try {
    // if no productId is found in the query, that means we are NOT editting the product
    // send a arbitary id number to let Node server know
    const { data } = await client.get(
      `http://localhost:5000/api/products/detail/${category}/${productId}`
    );

    return {
      props: {
        productId,
        product: data.product || null,
        editMode: productId ? true : false,
        // csrfToken: data.csrfToken,
      },
    };
  } catch (err) {
    console.log(
      "in add-product page catch error - something went wrong in the server"
    );
    return {
      props: {},
    };
  }
}
