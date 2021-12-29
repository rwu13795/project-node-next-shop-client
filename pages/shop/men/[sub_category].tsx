import type { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { MainCategory } from "../../../utils/enums-types/product-category";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";
import SubCatProductsList from "../../../components/shop/product/sub-cat-list";
import PageLinks from "../../../components/layout/page-links/links";
import { SubCat_PageProps } from "../../../utils/enums-types/categories-interfaces";
import { instantlyToTop } from "../../../utils/helper-functions/scrollToTopInstantly";
import serverClient from "../../../utils/axios-client/server-client";

// UI //
import { Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import styles from "./__cat.module.css";

const MenSubCatPage: NextPage<SubCat_PageProps> = ({
  products: startProducts,
  filterStats: startFilterStats,
  sub_cat,
  main_cat,
}) => {
  const dispatch = useDispatch();

  const props = { main_cat, sub_cat };

  useEffect(() => {
    dispatch(setPageLoading(false));
  });

  // when user navigate to other pages, the scroll position stays where it is
  // untill the new page is loaded. It causes the screen "jumps" to top
  // when the page or component is being unmount, use "instantlyToTop" to
  // scroll to top before the new page is loaded
  useEffect(() => {
    return instantlyToTop;
  }, []);

  const backToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className={styles.main_container}>
      <PageLinks {...props} />

      <SubCatProductsList
        startProducts={startProducts}
        startFilterStats={startFilterStats}
        sub_cat={sub_cat}
        main_cat={main_cat}
      />
      <Button className={styles.to_top_button} onClick={backToTopHandler}>
        <ArrowBackIosNewIcon className={styles.to_top_icon} />
        back to top
        <ArrowBackIosNewIcon className={styles.to_top_icon} />
      </Button>
    </main>
  );
};

export default MenSubCatPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sub_cat = context.query.sub_category;
  const main_cat = MainCategory.men.toLowerCase();

  const client = serverClient(context);

  const { data }: { data: SubCat_PageProps } = await client.get(
    `http://localhost:5000/api/products/get/${main_cat}/${sub_cat}`
  );

  return {
    props: {
      products: data.products,
      filterStats: data.filterStats,
      sub_cat,
      main_cat,
      page_cat: main_cat,
      filter_view: true,
    },
  };
}
