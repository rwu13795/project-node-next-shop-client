import type { GetServerSidePropsContext, NextPage } from "next";
import { useRef, useState } from "react";

import serverClient from "../../../util/axios-client/server-client";
import {
  MainCategory,
  MenCategory,
} from "../../../util/enums-types/product-category";
import useGetMoreProducts, {
  ProductProps,
} from "../../../util/react-hooks/get-more-products";

import { useLastElementRef } from "../../../util/react-hooks/last-elem-ref";
import RenderSubCatImage from "../../../components/shop/render-sub-cat-image";
import browserClient from "../../../util/axios-client/browser-client";
import axios from "axios";

interface PageProps {
  startProducts: ProductProps[];
}

const Men_T_shirts: NextPage<PageProps> = ({ startProducts }) => {
  // if (process.browser) {
  //   // set the scroll back to top manaully, otherwise, the 1st and 2nd pages will
  //   // be fetched when user refresh the page
  //   history.scrollRestoration = "manual";
  //   window.onbeforeunload = function () {
  //     window.scrollTo(0, 0);
  //   };
  // }

  const main_cat = MainCategory.men.toLowerCase();
  const sub_cat = MenCategory.Tshirts.toLowerCase();

  const [pageNum, setPageNum] = useState<number>(1);
  const { isLoading, error, products, hasMore } = useGetMoreProducts(
    pageNum,
    startProducts,
    main_cat,
    sub_cat
  );

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useLastElementRef(
    isLoading,
    observer,
    hasMore,
    setPageNum
  );

  /////////////////////////////
  console.log(products);

  return (
    <RenderSubCatImage
      products={products}
      isLoading={isLoading}
      lastElementRef={lastElementRef}
    />
  );
};

export default Men_T_shirts;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const client = serverClient(context);

//   const main = MainCategory.men.toLowerCase();
//   const sub = MenCategory.Tshirts.toLowerCase();

//   const { data } = await client.get(
//     `http://localhost:5000/api/products/${main}/${sub}`
//   );

//   console.log(data.products[1].id);

//   return { props: { startProducts: data.products } };
// }

export async function getStaticProps() {
  const main = MainCategory.men.toLowerCase();
  const sub = MenCategory.Tshirts.toLowerCase();

  const { data } = await axios.get(
    `http://localhost:5000/api/products/${main}/${sub}`
  );

  return { props: { startProducts: data.products }, revalidate: 3600 };
}
