import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useReducer, ChangeEvent, useEffect } from "react";

import useUpload from "../../utils/react-hooks/add-product-upload";
import addProductReducer, {
  initialColorProps,
  initialProductInfo,
  ProductState,
} from "../../utils/react-hooks/add-product-reducer";
import { Actions } from "../../utils/enums-types/product-reducer-actions";
import serverClient from "../../utils/axios-client/server-client";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "../../components/admin/add-edit-product/product-form";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";
import {
  selectAdminUser,
  selectCsrfToken_admin,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";

// UI
import { Divider, SelectChangeEvent, Grid } from "@mui/material";
import styles from "./__add-product.module.css";

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
  const reduxDispatch = useDispatch();

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
  const { postUpload, errors, setErrors, uploading } = useUpload({
    colorPropsList: state.colorPropsList,
    productInfo: state.productInfo,
    editMode,
    deletedImgaes: state.deletedImages,
    productId,
    admin_username: adminUser.admin_username,
    csrfToken,
    onSuccess: () => {
      console.log("OK");
      router.push(`/admin/products-list?${adminUser.admin_username}&page=1`);
    },
  });

  const uploadHandler = async () => {
    await postUpload();
  };

  useEffect(() => {
    reduxDispatch(setPageLoading(false));
  }, []);

  if (!loggedInAsAdmin) {
    return <h2>Loading . . . </h2>;
  }

  return (
    <main className={styles.main}>
      <Grid container className={styles.page_grid}>
        <div className={styles.main_title}>Add New Product</div>
        <Divider />

        <ProductForm
          dispatchAddInfo={dispatchAddInfo}
          productInfo={state.productInfo}
          colorPropsList={state.colorPropsList}
          propError={errors}
          setErrors={setErrors}
          editMode={editMode}
          dispatch={dispatch}
          uploadHandler={uploadHandler}
          uploading={uploading}
        />
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
