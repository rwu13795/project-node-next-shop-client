import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState, Fragment } from "react";

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
import MeunListDrawer from "../../components/layout/navbar-items/menu-list-drawer";

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
import { mainCatArray } from "../../utils/enums-types/product-category";

export interface ProductCatNumAdmin {
  [main_cat: string]: { [sub_cat: string]: number };
}

interface PageProps {
  productsTotal: number;
  product_category: ProductCatNumAdmin;
  products: PageProductProps[];
  main_cat: string;
  sub_cat: string;
}

const AdmimProductsListPage: NextPage<PageProps> = ({
  products: startProducts,
  product_category,
  productsTotal: startProductsTotal,
  main_cat: startMain,
  sub_cat: startSub,
}) => {
  const ITEMS_PER_PAGE = 6;

  const router = useRouter();
  const dispatch = useDispatch();
  const client = browserClient();

  const admin_username = useSelector(selectAdminUser).admin_username;
  const loadingStatus = useSelector(selectLoadingStatus_admin);
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);

  useEffect(() => {
    dispatch(getAdminStatus());
  }, []);

  useEffect(() => {
    if (!loggedInAsAdmin) {
      router.push("/admin");
    }
  }, []);

  const [products, setProducts] = useState<PageProductProps[]>(startProducts);
  const [productsTotal, setProductsTotal] =
    useState<number>(startProductsTotal);
  const [productCatNum, setProductCatNum] =
    useState<ProductCatNumAdmin>(product_category);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [main_cat, setMain_cat] = useState<string>(startMain);
  const [sub_cat, setSub_cat] = useState<string>(startSub);

  const fetchNewList = useCallback(
    async (pageNum: number, main: string, sub: string) => {
      const { data }: { data: PageProps } = await client.get(
        `http://localhost:5000/api/admin/get-products-list`,
        { params: { pageNum, main, sub } }
      );
      setProducts(data.products);
      setProductCatNum(data.product_category);
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
        fetchNewList(currentPage - 1, main_cat, sub_cat);
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchNewList(currentPage, main_cat, sub_cat);
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
    main_cat,
    sub_cat,
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

  const changePageHandler = async (event: any, page: number) => {
    console.log(page);
    if (page === currentPage) {
      return;
    }
    await fetchNewList(page, main_cat, sub_cat);
    setCurrentPage(page);
  };

  const selectCatHandler = async (main: string, sub: string) => {
    if (main === main_cat && sub === sub_cat) return;
    setMain_cat(main);
    setSub_cat(sub);
    setCurrentPage(1);
    await fetchNewList(1, main, sub);
  };

  useEffect(() => {
    dispatch(setPageLoading(false));
  }, []);

  return (
    <main className={styles.main}>
      <Grid container className={styles.main_grid}>
        <Grid item container className={styles.left_grid}>
          <Button variant="outlined" onClick={goToAddProduct}>
            add new product
          </Button>
          <h2>PRODUCTS CATEGORIES</h2>
          {mainCatArray.map((cat, index) => {
            return (
              <div key={index} className={styles.menu_draw_container}>
                <MeunListDrawer
                  cat={cat}
                  page="admin"
                  selectCatHandler={selectCatHandler}
                  productCatNum={productCatNum}
                />
              </div>
            );
          })}
        </Grid>

        <Grid item container className={styles.right_grid}>
          {!products || products.length === 0 ? (
            <div className={styles.right_grid_upper}>
              <div>
                No products found in the {main_cat.toUpperCase()}{" "}
                {sub_cat.toUpperCase()} category
              </div>
            </div>
          ) : (
            <Fragment>
              <div className={styles.right_grid_upper}>
                <div>
                  {main_cat.toUpperCase()} {sub_cat.toUpperCase()}
                </div>
              </div>
              <Grid item container className={styles.right_grid_lower}>
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
                      <div>
                        <ProductPreview
                          productId={p._id}
                          colorPropsList={p.colorPropsList}
                          productInfo={p.productInfo}
                          page="admin"
                        />
                      </div>
                      <div className={styles.button_group}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => editButtonHandler(p._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => deleteButtonHandler(p._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </Fragment>
          )}
        </Grid>
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
  const { main, sub } = context.query;

  let main_cat = "men";
  let sub_cat = "t-shirts";
  if (main && sub) {
    main_cat = main.toString().toLowerCase();
    sub_cat = sub.toString().toLowerCase();
  }

  try {
    const { data }: { data: PageProps } = await client.get(
      "http://localhost:5000/api/admin/get-products-list",
      { params: { pageNum: 1, main: main_cat, sub: sub_cat } }
    );

    return {
      props: {
        page: "admin",
        products: data.products,
        product_category: data.product_category,
        productsTotal: data.productsTotal,
        main_cat,
        sub_cat,
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
