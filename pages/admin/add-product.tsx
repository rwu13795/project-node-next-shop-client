import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useReducer, ChangeEvent, useEffect } from "react";

import useUpload from "../../utils/react-hooks/add-product-upload";
import SelectCategory from "../../components/admin/add-edit-product/select-category";
import AddTitle from "../../components/admin/add-edit-product/add-title";
import AddPrice from "../../components/admin/add-edit-product/add-price";
import AddDescription from "../../components/admin/add-edit-product/add-description";
import AddColorsProps from "../../components/admin/add-edit-product/add-color-props";
import addProductReducer, {
  initialColorProps,
  initialProductInfo,
  ProductState,
} from "../../utils/react-hooks/add-product-reducer";
import { Actions } from "../../utils/enums-types/product-reducer-actions";
import serverClient from "../../utils/axios-client/server-client";
import { useSelector } from "react-redux";
import {
  selectAdminUser,
  selectCsrfToken_admin,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";

// UI
import { Divider, SelectChangeEvent, Grid } from "@mui/material";
import styles from "./_add-product.module.css";

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
  loggedInAsAdmin: boolean;
}

const AddProductPage: NextPage<PageProps> = ({
  productId,
  product,
  editMode,
}) => {
  const router = useRouter();

  const adminUser = useSelector(selectAdminUser);
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);
  const csrfToken = useSelector(selectCsrfToken_admin);

  useEffect(() => {
    if (!loggedInAsAdmin) {
      router.push("/admin");
    }
  });

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
    admin_username: adminUser.admin_username,
    csrfToken,
    onSuccess: () => {
      console.log("OK");
      router.push("/admin/products-list");
      // console.log(productPropList);
    },
  });

  const uploadHandler = async () => {
    await postUpload();
  };

  console.log(csrfToken);

  return (
    <main className={styles.main}>
      <h4 className={styles.main_title}>Add New Product</h4>
      <Divider />
      <Grid
        container
        flexDirection="row"
        justifyContent="center"
        className={styles.page_body}
        sx={{ minWidth: "80vw" }}
      >
        <Grid
          item
          container
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            item
            container
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-end"
            xs={12}
            md={6}
          >
            <Grid item xs={12} md={6}>
              <SelectCategory
                dispatchAddInfo={dispatchAddInfo}
                productInfo={state.productInfo}
                propError={errors}
                setErrors={setErrors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AddTitle
                dispatchAddInfo={dispatchAddInfo}
                productInfo={state.productInfo}
                propError={errors}
                setErrors={setErrors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AddPrice
                dispatchAddInfo={dispatchAddInfo}
                productInfo={state.productInfo}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <AddDescription
              dispatchAddInfo={dispatchAddInfo}
              productInfo={state.productInfo}
              propError={errors}
              setErrors={setErrors}
            />
          </Grid>
        </Grid>
        <Grid item container>
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
        </Grid>
      </Grid>
    </main>
  );
};

export default AddProductPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { productId } = context.query;
  const client = serverClient(context);

  if (!productId) {
    return {
      props: { page: "admin", product: null },
    };
  }

  try {
    // if no productId is found in the query, that means we are NOT editting the product
    // send a arbitary id number to let Node server know
    const { data }: { data: PageProps } = await client.get(
      `http://localhost:5000/api/products/detail/${productId}`
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
