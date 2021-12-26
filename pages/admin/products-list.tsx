import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState, Fragment } from "react";

import serverClient from "../../utils/axios-client/server-client";
import ProductPreview from "../../components/image/product-preview/preview";
import { PageProductProps } from "../../utils/react-hooks/get-more-products";
import {
  getAdminStatus,
  selectAdminUser,
  select_selectedAdmin,
  setSelectedAdmin,
} from "../../utils/redux-store/adminSlice";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";
import browserClient from "../../utils/axios-client/browser-client";
import MeunListDrawer from "../../components/layout/navbar-items/menu-list-drawer";
import DeleteProdcutModal from "../../components/admin/delete-product-modal";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import {
  selectCurrentCats_adminProduct,
  setCurrentCats_adminProduct,
  deleteProduct,
  selectUploadStatus_adminProduct,
  setUploadStatus_adminProduct,
  resetState_adminProduct,
} from "../../utils/redux-store/adminProductSlice";

// UI //
import {
  Grid,
  Pagination,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./__product-list.module.css";

export interface ProductCatNumAdmin {
  [main_cat: string]: { [sub_cat: string]: number };
}

interface PageProps {
  productsTotal: number;
  product_category: ProductCatNumAdmin;
  products: PageProductProps[];
  main_cat: string;
  sub_cat: string;
  admin_username_array: string[];
  start_selectedAdmin: string;
}

export interface DeleteProduct {
  id: string;
  image: string;
  title: string;
  admin_username?: string;
}

const adminMainCatArray = ["Women", "Men", "Kids"];

const AdmimProductsListPage: NextPage<PageProps> = ({
  products: startProducts,
  product_category,
  productsTotal: startProductsTotal,
  main_cat: startMain,
  sub_cat: startSub,
  admin_username_array,
  start_selectedAdmin,
}) => {
  const ITEMS_PER_PAGE = 6;

  const router = useRouter();
  const dispatch = useDispatch();
  const client = browserClient();

  const admin_username = useSelector(selectAdminUser).admin_username;
  const uploadStatus = useSelector(selectUploadStatus_adminProduct);
  const { main_cat, sub_cat } = useSelector(selectCurrentCats_adminProduct);
  const selectedAdmin = useSelector(select_selectedAdmin);

  useEffect(() => {
    dispatch(getAdminStatus());
    dispatch(resetState_adminProduct());
    dispatch(setCurrentCats_adminProduct({ main: startMain, sub: startSub }));
    return instantlyToTop;
  }, []);

  useEffect(() => {
    dispatch(setPageLoading(false));
  });

  const [products, setProducts] = useState<PageProductProps[]>(startProducts);
  const [productsTotal, setProductsTotal] =
    useState<number>(startProductsTotal);
  const [productCatNum, setProductCatNum] =
    useState<ProductCatNumAdmin>(product_category);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [main_cat, setMain_cat] = useState<string>(startMain);
  // const [sub_cat, setSub_cat] = useState<string>(startSub);
  const [delete_product, setDelete_product] = useState<DeleteProduct>({
    id: "",
    image: "",
    title: "",
    admin_username: "",
  });
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  // const [selectedAdmin, setSelectedAdmin] = useState<string>(admin_username);

  // set the current selected admin
  useEffect(() => {
    dispatch(setSelectedAdmin(admin_username));
  }, [admin_username, dispatch]);
  useEffect(() => {
    if (start_selectedAdmin !== "") {
      dispatch(setSelectedAdmin(start_selectedAdmin));
    }
  }, [start_selectedAdmin, dispatch]);

  const fetchNewList = useCallback(
    async (
      pageNum: number,
      main: string,
      sub: string,
      admin_username: string
    ) => {
      const { data }: { data: PageProps } = await client.get(
        `http://localhost:5000/api/admin/get-products-list`,
        // when the master admin selects another admin, use that admin_username
        // to fetch the product list
        { params: { pageNum, main, sub, admin_username } }
      );
      setProducts(data.products);
      setProductCatNum(data.product_category);
      setProductsTotal(data.productsTotal);
    },
    [client]
  );

  useEffect(() => {
    // fetch new list after deleting an item to update the page
    if (uploadStatus === "succeeded") {
      dispatch(setUploadStatus_adminProduct("idle"));
      // if products.length less than 2, that means there was only 1 item on the
      // current page before deleting, so I need to fetch items from the page in front
      if (products.length < 2 && currentPage > 1) {
        fetchNewList(currentPage - 1, main_cat, sub_cat, selectedAdmin);
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchNewList(currentPage, main_cat, sub_cat, selectedAdmin);
      }
      dispatch(setPageLoading(false));
    }
  }, [
    uploadStatus,
    dispatch,
    router,
    fetchNewList,
    currentPage,
    products.length,
    main_cat,
    sub_cat,
    selectedAdmin,
  ]);

  const goToAddProduct = () => {
    dispatch(setPageLoading(true));
    router.push("/admin/add-product");
  };

  const editButtonHandler = (productId: string) => {
    dispatch(setPageLoading(true));
    router.push(`/admin/add-product?productId=${productId}`);
  };

  const changePageHandler = async (event: any, page: number) => {
    console.log(page);
    if (page === currentPage) {
      return;
    }
    await fetchNewList(page, main_cat, sub_cat, selectedAdmin);

    let elem = document.getElementById("admin_cat_title");
    if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
    setCurrentPage(page);
  };

  const selectCatHandler = async (main: string, sub: string) => {
    if (main === main_cat && sub === sub_cat) return;
    dispatch(setCurrentCats_adminProduct({ main, sub }));
    setCurrentPage(1);
    await fetchNewList(1, main, sub, selectedAdmin);
  };

  const deleteProductHandler = () => {
    dispatch(setPageLoading(true));
    dispatch(
      deleteProduct({
        productId: delete_product.id,
        admin_username: selectedAdmin,
      })
    );
    setOpenDeleteModal(false);
  };

  const deleteModalHandler = (id: string, image: string, title: string) => {
    setDelete_product({ id, image, title });
    setOpenDeleteModal(true);
  };

  const selectAdminHandler = async (e: SelectChangeEvent<string>) => {
    const newSelect = e.target.value;
    if (newSelect === selectedAdmin) return;

    setCurrentPage(1);
    await fetchNewList(1, main_cat, sub_cat, newSelect);

    dispatch(setSelectedAdmin(newSelect));
    // setSelectedAdmin(newSelect);
  };

  if (Object.keys(product_category).length === 0) {
    return (
      <main>
        <h1>You have not added any product, yet</h1>
        <div className={`${styles.inner_grid} ${styles.margin_bottom}`}>
          <Button variant="outlined" onClick={goToAddProduct}>
            add new product
          </Button>
        </div>
      </main>
    );
  }

  console.log("re-render in root");

  return (
    <main className={styles.main}>
      <div className={styles.main_grid}>
        <div className={styles.left_grid}>
          <Button variant="outlined" onClick={goToAddProduct}>
            add new product
          </Button>

          {admin_username_array.length > 0 && (
            <div className={styles.select_admin_box}>
              <div className={styles.title_2}>SELECT ADMINISTRATOR</div>
              <FormControl className={styles.select_control}>
                <InputLabel>ADMIN</InputLabel>
                <Select
                  value={selectedAdmin}
                  label="ADMIN"
                  onChange={selectAdminHandler}
                >
                  {admin_username_array.map((admin) => {
                    return (
                      <MenuItem key={admin} value={admin}>
                        {admin}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          )}

          <div className={styles.title_2}>PRODUCTS CATEGORIES</div>
          {adminMainCatArray.map((cat, index) => {
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
        </div>

        <div className={styles.right_grid}>
          {admin_username_array.length > 0 && (
            <div className={styles.title_1} style={{ marginBottom: "10px" }}>
              Managing the products of Admin: &ldquo;
              <span style={{ color: "red" }}>{selectedAdmin}</span>&rdquo;
            </div>
          )}

          {!products || products.length === 0 ? (
            <div className={styles.right_grid_upper}>
              <div className={styles.title_1} id="admin_cat_title">
                No product found in the {main_cat.toUpperCase()}{" "}
                {sub_cat.toUpperCase()} category
              </div>
            </div>
          ) : (
            <Fragment>
              <div className={styles.right_grid_upper}>
                <div className={styles.title_1} id="admin_cat_title">
                  {main_cat.toUpperCase()} {sub_cat.toUpperCase()}
                </div>
              </div>
              <div className={styles.right_grid_lower}>
                {products.map((p) => {
                  const id = p._id;
                  const image = p.colorPropsList[0].imageFiles[0];
                  const title = p.productInfo.title;
                  return (
                    <Grid
                      item
                      container
                      className={styles.inner_grid}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={6}
                      key={p._id}
                    >
                      <ProductPreview
                        productId={p._id}
                        colorPropsList={p.colorPropsList}
                        productInfo={p.productInfo}
                        oneItemPerRow={false}
                        page="admin"
                      />

                      <div className={styles.button_group}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => editButtonHandler(p._id)}
                          sx={{ width: "40%", fontSize: "min(12px, 3vw)" }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => deleteModalHandler(id, image, title)}
                          sx={{ width: "40%", fontSize: "min(12px, 3vw)" }}
                        >
                          Delete
                        </Button>
                      </div>
                    </Grid>
                  );
                })}
              </div>
            </Fragment>
          )}
        </div>
      </div>
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

      <DeleteProdcutModal
        openDeleteModal={openDeleteModal}
        delete_product={delete_product}
        setOpenDeleteModal={setOpenDeleteModal}
        deleteProductHandler={deleteProductHandler}
      />
    </main>
  );
};

export default AdmimProductsListPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);
  const { main, sub, admin_username } = context.query;

  console.log(admin_username);

  let main_cat = "men";
  let sub_cat = "t-shirts";
  if (main && sub) {
    main_cat = main.toString().toLowerCase();
    sub_cat = sub.toString().toLowerCase();
  }

  try {
    const { data }: { data: PageProps } = await client.get(
      "http://localhost:5000/api/admin/get-products-list",
      { params: { pageNum: 1, main: main_cat, sub: sub_cat, admin_username } }
    );

    console.log(data);

    return {
      props: {
        page: "admin",
        products: data.products,
        product_category: data.product_category || {},
        productsTotal: data.productsTotal,
        admin_username_array: data.admin_username_array,
        start_selectedAdmin: data.start_selectedAdmin,
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
