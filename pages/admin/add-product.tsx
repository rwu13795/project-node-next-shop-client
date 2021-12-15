import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, {
  useReducer,
  ChangeEvent,
  useEffect,
  useState,
  SyntheticEvent,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";

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
import ProductReviews from "../../components/shop/product/product-detail/reviews/reviews";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";
import {
  getAdminStatus,
  selectAdminUser,
  selectCsrfToken_admin,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";

// UI
import {
  Divider,
  SelectChangeEvent,
  Grid,
  Tab,
  Box,
  Button,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import styles from "./__add-product.module.css";
import { Reviews } from "../shop/product-detail/[product_id]";
import browserClient from "../../utils/axios-client/browser-client";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";

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
  reviews: Reviews;
  editMode: boolean;
  page: string;
}

const AddProductPage: NextPage<PageProps> = ({
  productId,
  product,
  editMode,
  reviews,
  page,
}) => {
  // NOTE //
  // whenever there is a change in any one of the states in the reducer
  // all the components

  const client = browserClient();
  const router = useRouter();
  const reduxDispatch = useDispatch();

  const adminUser = useSelector(selectAdminUser);
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);
  const csrfToken = useSelector(selectCsrfToken_admin);

  const [stage, setStage] = useState<string>("1");
  const [reviewDoc, setReviewDoc] = useState<Reviews>(reviews);
  const [stayOnPage, setStayOnPage] = useState<number>(1);
  const [stayOnFilter, setStayOnFilter] = useState<string>("");

  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    reduxDispatch(getAdminStatus());
  }, [reduxDispatch]);

  const [state, dispatch] = useReducer(
    addProductReducer,
    product ? product : initialProductState
  );

  // useEffect(() => {
  //   if (!loggedInAsAdmin) {
  //     router.push("/admin");
  //   } else {
  //     setCheckingAuth(false);
  //   }
  // }, []);

  useEffect(() => {
    reduxDispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  const dispatchAddInfo = useCallback((e: AddInfoEvents) => {
    const inputValue = e.target.value;
    const inputField = e.target.name;
    dispatch({
      type: Actions.addInfo,
      payload: { inputField, inputValue },
    });
  }, []);

  // const dispatchAddInfo = (e: AddInfoEvents) => {
  //   const inputValue = e.target.value;
  //   const inputField = e.target.name;
  //   dispatch({
  //     type: Actions.addInfo,
  //     payload: { inputField, inputValue },
  //   });
  // };

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
      router.push(
        `/admin/products-list?main=${state.productInfo.main_cat}&sub=${state.productInfo.sub_cat}`
      );
    },
  });

  const uploadHandler = async () => {
    await postUpload();
  };

  const tagChangeHandler = (event: SyntheticEvent, newValue: string) => {
    setStage(newValue);
  };

  const refreshReviewsAdmin = async (pageNum: number, reviewFilter: string) => {
    const { data } = await client.post(
      "http://localhost:5000/api/products/get-reviews",
      { productId, pageNum, filter: reviewFilter }
    );
    const { reviewDoc, newPage } = data;

    setStayOnFilter(reviewFilter);
    setStayOnPage(newPage);
    setReviewDoc(reviewDoc);
  };

  // if (checkingAuth) {
  //   return <div>Loading ...</div>;
  // }

  return (
    <main className={styles.main}>
      {editMode ? (
        <Grid container className={styles.main_grid}>
          <TabContext value={stage}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Grid
                container
                wrap="nowrap"
                justifyContent="space-around"
                className={styles.edit_tab_grid}
              >
                <TabList onChange={tagChangeHandler}>
                  <Tab
                    label="EDIT PRODUCT"
                    value={"1"}
                    className={styles.edit_tab}
                  />
                  <Tab
                    label="EDIT REVIEWS"
                    value={"2"}
                    className={styles.edit_tab}
                  />
                </TabList>
              </Grid>
              <Divider />
            </Box>
            <TabPanel value={"1"}>
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
            </TabPanel>
            <TabPanel value={"2"}>
              <ProductReviews
                reviewDoc={reviewDoc}
                page={page}
                openAddReivewModal={false}
                refreshReviewsAdmin={refreshReviewsAdmin}
                stayOnPage={stayOnPage}
                stayOnFilter={stayOnFilter}
                editMode={editMode}
              />
              <Button
                color="error"
                variant="outlined"
                className={styles.form_button}
                onClick={() => {
                  router.push("/admin/products-list");
                }}
              >
                Back
              </Button>
            </TabPanel>
          </TabContext>
        </Grid>
      ) : (
        <Grid container className={styles.main_grid}>
          <div className={styles.main_title}>Add New Product</div>

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
      )}
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
      `http://localhost:5000/api/products/detail/${productId}?admin="yes"`
    );
    return {
      props: {
        productId,
        product: data.product || null,
        editMode: productId ? true : false,
        reviews: data.reviews,
        page: "admin",
      },
    };
  } catch (err) {
    console.log("in add-product page catch error - Admin auth required");
    return {
      props: { page: "admin" },
    };
  }
}
