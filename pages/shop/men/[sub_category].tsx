import type { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import {
  MainCategory,
  MenCategory,
} from "../../../utils/enums-types/product-category";
import useGetMoreProducts, {
  PageProductProps,
} from "../../../utils/react-hooks/get-more-products";

import useLastElementRef from "../../../utils/react-hooks/last-elem-ref";
import RenderSubCatImage from "../../../components/shop/product/sub-cat-list";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

interface PageProps {
  products: PageProductProps[];
  sub_cat: string;
  main_cat: string;
}

const MenTshirtsPage: NextPage<PageProps> = ({
  products: startProducts,
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

  useEffect(() => {
    dispatch(setPageLoading(false));
  }, []);

  // I have to move the "useGetMoreProducts" to the render-sub-cat, because the react
  // hook cannot be called conditionally. when the startProducts changes with the sub_cat,
  // the "useGetMoreProducts" will not update the products correctly
  if (!startProducts || startProducts.length < 1) {
    return <h1>No Products</h1>;
  }
  // const [pageNum, setPageNum] = useState<number>(1);
  // const { isLoading, error, products, hasMore } = useGetMoreProducts(
  //   pageNum,
  //   startProducts,
  //   main_cat,
  //   sub_cat
  // );

  // const observer = useRef<IntersectionObserver>();
  // const lastElementRef = useLastElementRef(
  //   isLoading,
  //   observer,
  //   hasMore,
  //   setPageNum
  // );
  /////////////////////////////

  return (
    <div>
      <RenderSubCatImage
        startProducts={startProducts}
        sub_cat={sub_cat}
        main_cat={main_cat}
      />
    </div>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sub_cat = context.query.sub_category;
  const main_cat = MainCategory.men.toLowerCase();

  const { data }: { data: PageProps } = await axios.get(
    `http://localhost:5000/api/products/${main_cat}/${sub_cat}`
  );

  console.log(data);

  return {
    props: { products: data.products, sub_cat, main_cat, page_cat: main_cat },
  };
}
