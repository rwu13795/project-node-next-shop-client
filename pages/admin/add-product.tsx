import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { ChangeEvent, useEffect, useState, SyntheticEvent } from "react";

import serverClient from "../../utils/axios-client/server-client";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "../../components/admin/add-edit-product/product-form";
import ProductReviews from "../../components/shop/product/product-detail/reviews/reviews";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";
import { getAdminStatus } from "../../utils/redux-store/adminSlice";
import { Reviews } from "../shop/product-detail/[product_id]";
import browserClient from "../../utils/axios-client/browser-client";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import {
  AddProductState,
  selectCurrentCats_adminProduct,
  setInitialState_adminProduct,
} from "../../utils/redux-store/adminProductSlice";

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

export type AddInfoEvents =
  | ChangeEvent<HTMLInputElement>
  | SelectChangeEvent<string>
  | ChangeEvent<HTMLTextAreaElement>;

interface PageProps {
  productId: string;
  product: AddProductState;
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
  const client = browserClient();
  const router = useRouter();
  const dispatch = useDispatch();
  const { main_cat, sub_cat } = useSelector(selectCurrentCats_adminProduct);

  const [stage, setStage] = useState<string>("1");
  const [reviewDoc, setReviewDoc] = useState<Reviews>(reviews);
  const [stayOnPage, setStayOnPage] = useState<number>(1);
  const [stayOnFilter, setStayOnFilter] = useState<string>("");

  useEffect(() => {
    dispatch(getAdminStatus());
  }, [dispatch]);

  useEffect(() => {
    if (product !== null) {
      dispatch(setInitialState_adminProduct(product));
    }
  }, [product, dispatch]);

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  const tagChangeHandler = (event: SyntheticEvent, newValue: string) => {
    setStage(newValue);
  };

  const refreshReviewsAdmin = async (pageNum: number, reviewFilter: string) => {
    const { data } = await client.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/products/get-reviews`,
      { productId, pageNum, filter: reviewFilter }
    );
    const { reviewDoc, newPage } = data;

    setStayOnFilter(reviewFilter);
    setStayOnPage(newPage);
    setReviewDoc(reviewDoc);
  };

  // NOTE //
  // always, only pass the specific value which will be consumed by the component
  // DO NOT pass the entire object to the child component which only needs part of
  // the value in the object (for instance, in the "select-color" component, it only
  // needs the "colorName" and "colorCode" from the "colorProp", if I pass the entire
  // "colorProp" to the "select-color", even there is change apart from the "colorName"
  // and "colorCode", "select-color" component will be re-rendered since the entire
  // "colorProp" object is passed into it)

  return (
    <main className={styles.main}>
      {editMode ? (
        <div className={styles.main_grid}>
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
              <ProductForm editMode={editMode} productId={productId} />
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
                  router.push(
                    `/admin/products-list?main=${main_cat}&sub=${sub_cat}`
                  );
                }}
              >
                Back to products list
              </Button>
            </TabPanel>
          </TabContext>
        </div>
      ) : (
        <div className={styles.main_grid}>
          <div className={styles.main_title}>ADD NEW PRODUCT</div>

          <ProductForm editMode={editMode} />
        </div>
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
    const { data }: { data: PageProps } = await client.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/products/detail/${productId}?admin="yes"`
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
