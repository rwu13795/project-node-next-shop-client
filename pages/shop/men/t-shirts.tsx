import type { NextPage } from "next";
import { useRef, useState } from "react";

import {
  MainCategory,
  MenCategory,
} from "../../../utils/enums-types/product-category";
import useGetMoreProducts, {
  PageProductProps,
} from "../../../utils/react-hooks/get-more-products";

import { useLastElementRef } from "../../../utils/react-hooks/last-elem-ref";
import RenderSubCatImage from "../../../components/shop/render-sub-cat-image";
import axios from "axios";

interface PageProps {
  startProducts: PageProductProps[];
}

const MenTshirtsPage: NextPage<PageProps> = ({ startProducts }) => {
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

export default MenTshirtsPage;

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