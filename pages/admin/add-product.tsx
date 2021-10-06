import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useReducer, ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import useUpload from "../../utils/react-hooks/add-product-upload";
import SelectCategory from "../../components/admin/select-category";
import AddTitle from "../../components/admin/add-title";
import AddPrice from "../../components/admin/add-price";
import AddDescription from "../../components/admin/add-description";
import AddColorsProps from "../../components/admin/add-color-props";
import addProductReducer, {
  initialColorProps,
  initialProductInfo,
  ProductState,
} from "../../utils/react-hooks/add-product-reducer";
import { Actions } from "../../utils/enums-types/product-reducer-actions";
import serverClient from "../../utils/axios-client/server-client";

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

const AddProductPage: NextPage<PageProps> = ({
  productId,
  product,
  editMode,
}) => {
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
  const { postUpload, errors, setErrors } = useUpload({
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
  // console.log(state);

  return (
    <main>
      <h1>Add New Product</h1>
      <div>
        <label>Category: </label>
        <SelectCategory
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
          propError={errors}
          setErrors={setErrors}
        />
      </div>
      <div>
        <AddTitle
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
          propError={errors}
          setErrors={setErrors}
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
          setErrors={setErrors}
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
            setErrors={setErrors}
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

export default AddProductPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const { productId, category } = context.query;
  const client = serverClient(context);

  const productId = "614f66eff572a86ea5461927";
  const category = "men";

  if (!productId) {
    return {
      props: { page: "admin" },
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
        page: "admin",
      },
    };
  } catch (err) {
    console.log(
      "in add-product page catch error - something went wrong in the server"
    );
    return {
      props: { page: "admin" },
    };
  }
}
