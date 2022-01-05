import type { NextPage } from "next";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import Head from "next/head";

import { instantlyToTop } from "../../../utils/helper-functions/scrollToTopInstantly";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";
import MainCatProductsList from "../../../components/shop/product/main-cat-list";
import { MainCat_PageProps } from "../../../utils/enums-types/categories-interfaces";

// UI //
import styles from "./__cat.module.css";

const KidsMainCatPage: NextPage<MainCat_PageProps> = ({
  products,
  subCatTitles,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  return (
    <main className={styles.main_container}>
      <Head>
        <title>Kids</title>
      </Head>

      <MainCatProductsList
        products={products}
        subCatTitles={subCatTitles}
        main_cat="kids"
      />
    </main>
  );
};

export default KidsMainCatPage;

export async function getStaticProps() {
  const { data }: { data: MainCat_PageProps } = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/get/kids`
  );

  return {
    props: {
      products: data.products,
      subCatTitles: data.subCatTitles,
      page_cat: "kids",
    },
  };
}
