import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";

import serverClient from "../../utils/axios-client/server-client";
import ProductPreview from "../../components/image/product-preview/preview";
import { PageProductProps } from "../../utils/react-hooks/get-more-products";
import {
  deleteProduct,
  getAdminStatus,
  selectAdminUser,
  selectLoadingStatus_admin,
  selectLoggedInAsAdmin,
  setLoadingStatus_admin,
} from "../../utils/redux-store/adminSlice";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";
import browserClient from "../../utils/axios-client/browser-client";

// UI //
import {
  Divider,
  Grid,
  TextField,
  Box,
  Pagination,
  Button,
} from "@mui/material";
import styles from "./__product-list.module.css";

interface PageProps {
  productsTotal: number;
  products: PageProductProps[];
}

const AdmimProductsListPage: NextPage<PageProps> = ({
  products: startProducts,
  productsTotal: startProductsTotal,
}) => {
  const ITEMS_PER_PAGE = 6;

  const router = useRouter();
  const dispatch = useDispatch();
  const client = browserClient();

  const admin_username = useSelector(selectAdminUser).admin_username;
  const loadingStatus = useSelector(selectLoadingStatus_admin);
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);

  const [products, setProducts] = useState<PageProductProps[]>(startProducts);
  const [productsTotal, setProductsTotal] =
    useState<number>(startProductsTotal);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(getAdminStatus());
  }, []);

  useEffect(() => {
    if (!loggedInAsAdmin) {
      router.push("/admin");
    }
  }, []);

  const fetchNewList = useCallback(
    async (pageNum: number) => {
      const { data }: { data: PageProps } = await client.get(
        "http://localhost:5000/api/admin/get-products-list",
        { params: { pageNum } }
      );
      setProducts(data.products);
      setProductsTotal(data.productsTotal);
    },
    [client]
  );

  useEffect(() => {
    // fetch new list after deleting an item to update the page
    if (loadingStatus === "succeeded") {
      dispatch(setLoadingStatus_admin("idle"));
      // if products.length less than 2, that means there was only 1 item on the
      // current page before deleting, so I need to fetch items from the page in front
      if (products.length < 2 && currentPage > 1) {
        fetchNewList(currentPage - 1);
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchNewList(currentPage);
      }

      dispatch(setPageLoading(false));
    }
  }, [
    loadingStatus,
    dispatch,
    router,
    fetchNewList,
    currentPage,
    products.length,
  ]);

  const goToAddProduct = () => {
    dispatch(setPageLoading(true));
    router.push("/admin/add-product");
  };

  const editButtonHandler = (productId: string) => {
    dispatch(setPageLoading(true));
    router.push(`/admin/add-product?productId=${productId}`);
  };

  const deleteButtonHandler = async (productId: string) => {
    dispatch(setPageLoading(true));
    dispatch(deleteProduct({ productId, admin_username }));
  };

  useEffect(() => {
    dispatch(setPageLoading(false));
  }, []);

  const changePageHandler = async (event: any, page: number) => {
    console.log(page);
    if (page === currentPage) {
      return;
    }
    await fetchNewList(page);
    setCurrentPage(page);
  };

  if (!products) {
    return (
      <main>
        <h1>No Product Found</h1>
        <button onClick={goToAddProduct}>add new product</button>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.inner_grid}>
        <Button variant="outlined" onClick={goToAddProduct}>
          add new product
        </Button>
      </div>

      <Grid container className={styles.main_grid}>
        {products.map((p) => {
          return (
            <Grid
              item
              container
              className={styles.inner_grid}
              md={4}
              sm={6}
              xs={6}
              key={p._id}
            >
              <ProductPreview
                productId={p._id}
                colorPropsList={p.colorPropsList}
                productInfo={p.productInfo}
              />
              <div>
                <button onClick={() => editButtonHandler(p._id)}>Edit</button>
                <button onClick={() => deleteButtonHandler(p._id)}>
                  Delete
                </button>
              </div>
            </Grid>
          );
        })}
      </Grid>
      <div className={`${styles.inner_grid} ${styles.margin_bottom}`}>
        <Pagination
          count={Math.ceil(productsTotal / ITEMS_PER_PAGE)}
          color="primary"
          onChange={changePageHandler}
          page={currentPage}
        />
      </div>

      <div className={`${styles.inner_grid} ${styles.margin_bottom}`}>
        <Button variant="outlined" onClick={goToAddProduct}>
          add new product
        </Button>
      </div>
    </main>
  );
};

export default AdmimProductsListPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  try {
    const { data }: { data: PageProps } = await client.get(
      "http://localhost:5000/api/admin/get-products-list"
    );

    return {
      props: {
        page: "admin",
        products: data.products,
        productsTotal: data.productsTotal,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
}
