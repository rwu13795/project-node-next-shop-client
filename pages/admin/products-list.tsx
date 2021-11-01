import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";

import serverClient from "../../utils/axios-client/server-client";
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

interface PageProps {
  productsTotal: number;
  products: PageProductProps[];
  page_num: number;
}

const AdmimProductsListPage: NextPage<PageProps> = ({
  products: startProducts,
  page_num,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const client = browserClient();

  const admin_username = useSelector(selectAdminUser).admin_username;
  const loadingStatus = useSelector(selectLoadingStatus_admin);
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);

  const [products, setProducts] = useState<PageProductProps[]>(startProducts);

  const [params] = useState({ admin_username, page_num });

  // useEffect(() => {
  //   if (!loggedInAsAdmin) {
  //     router.push("/admin");
  //   }
  // }, [loggedInAsAdmin, router, dispatch]);

  const fetchNewList = useCallback(async () => {
    const { data }: { data: PageProps } = await client.get(
      "http://localhost:5000/api/admin/get-products-list",
      { params }
    );
    setProducts(data.products);
  }, [params, client]);

  useEffect(() => {
    // reload the page after deleting an item
    if (loadingStatus === "succeeded") {
      dispatch(setLoadingStatus_admin("idle"));
      fetchNewList();
      dispatch(setPageLoading(false));
    }
  }, [loadingStatus, dispatch, router, fetchNewList]);

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

  if (!products) {
    return <h1>No Product Found</h1>;
  }

  return (
    <main>
      <button onClick={goToAddProduct}>add new product</button>

      <div>
        {products.map((p) => {
          return (
            <div key={p._id}>
              <div>Title: {p.productInfo.title}</div>
              <div>Price: {p.productInfo.price}</div>
              <div>Description: {p.productInfo.description}</div>
              <Image
                src={p.colorPropsList[0].imageFiles[0]}
                alt={p.productInfo.title}
                width={100}
                height={100}
              />
              <div>
                Colors:
                {p.colorPropsList.map((prop) => {
                  return <span key={prop.colorName}>{prop.colorName} </span>;
                })}
              </div>
              <div>
                <button onClick={() => editButtonHandler(p._id)}>Edit</button>
                <button onClick={() => deleteButtonHandler(p._id)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default AdmimProductsListPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  const { admin_username, page: page_num } = context.query;

  if (admin_username === undefined || admin_username === "") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const params = { admin_username, page_num };

  try {
    const { data }: { data: PageProps } = await client.get(
      "http://localhost:5000/api/admin/get-products-list",
      { params }
    );

    console.log(data);

    return {
      props: {
        page: "admin",
        products: data.products,
        productsTotal: data.productsTotal,
        page_num,
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
