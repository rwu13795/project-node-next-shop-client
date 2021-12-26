import type { NextPage } from "next";
import Link from "next/link";
import { useState, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { instantlyToTop } from "../../../utils/helper-functions/scrollToTopInstantly";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";
import MainCatProductsList from "../../../components/shop/product/main-cat-list";
import { MainCat_PageProps } from "../../../utils/enums-types/categories-interfaces";

// UI //
import { Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import styles from "./__cat.module.css";

const Men: NextPage<MainCat_PageProps> = ({ products, subCatTitles }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  return (
    <main className={styles.main_container}>
      <MainCatProductsList
        products={products}
        subCatTitles={subCatTitles}
        main_cat="men"
      />
    </main>
  );
};

export default Men;

export async function getStaticProps() {
  const { data }: { data: MainCat_PageProps } = await axios.get(
    "http://localhost:5000/api/products/get/men"
  );

  return {
    props: {
      products: data.products,
      subCatTitles: data.subCatTitles,
      page_cat: "men",
    },
  };
}
