import type { NextPage } from "next";
import Link from "next/link";
import { useState, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";

import { instantlyToTop } from "../../../utils/helper-functions/scrollToTopInstantly";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";
import MainCatProductsList from "../../../components/shop/product/main-cat-list";

// UI //
import { Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import styles from "./__cat.module.css";

const Men: NextPage = ({}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  return (
    <main className={styles.main_container}>
      <MainCatProductsList />
    </main>
  );
};

export default Men;

export function getServerSideProps() {
  return { props: { page_cat: "men" } };
}
