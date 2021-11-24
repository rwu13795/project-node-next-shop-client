import type { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import {
  MainCategory,
  MenCategory,
} from "../../../utils/enums-types/product-category";
import useGetMoreProducts, {
  PageProductProps,
} from "../../../utils/react-hooks/get-more-products";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";
import SubCatProductsList from "../../../components/shop/product/sub-cat-list";
import PageLinks from "../../../components/layout/page-links/links";
import { SubCat_PageProps } from "../../../utils/enums-types/categories-interfaces";

import styles from "./__sub-cat.module.css";

const MenTshirtsPage: NextPage<SubCat_PageProps> = ({
  products: startProducts,
  filterStats: startFilterStats,
  sub_cat,
  main_cat,
}) => {
  // if (process.browser) {
  //   // set the scroll back to top manaully, otherwise, the 1st and 2nd pages will
  //   // be fetched when user refresh the page
  //   history.scrollRestoration = "manual";
  //   window.onbeforeunload = function () {
  //     window.scrollTo(0, 0);
  //   };
  // }
  const dispatch = useDispatch();

  const props = { main_cat, sub_cat };

  useEffect(() => {
    dispatch(setPageLoading(false));
  });

  // I have to move the "useGetMoreProducts" to the render-sub-cat, because the react
  // hook cannot be called conditionally. when the startProducts changes with the sub_cat,
  // the "useGetMoreProducts" will not update the products correctly
  if (!startProducts || startProducts.length < 1) {
    return <h1>No Products</h1>;
  }

  return (
    <main className={styles.main_container}>
      <PageLinks {...props} />
      <SubCatProductsList
        startProducts={startProducts}
        startFilterStats={startFilterStats}
        sub_cat={sub_cat}
        main_cat={main_cat}
      />
    </main>
  );
};

export default MenTshirtsPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sub_cat = context.query.sub_category;
  const main_cat = MainCategory.men.toLowerCase();

  const { data }: { data: SubCat_PageProps } = await axios.get(
    `http://localhost:5000/api/products/${main_cat}/${sub_cat}`
  );

  console.log(data);

  return {
    props: {
      products: data.products,
      filterStats: data.filterStats,
      sub_cat,
      main_cat,
      page_cat: main_cat,
    },
  };
}
