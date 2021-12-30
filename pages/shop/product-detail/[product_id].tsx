import { GetServerSidePropsContext, NextPage } from "next";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { PageProductProps } from "../../../utils/react-hooks/get-more-products";

import ProductDetail from "../../../components/shop/product/product-detail/product-detail";
import serverClient from "../../../utils/axios-client/server-client";

// UI //
import styles from "./__detail.module.css";
import PageLinks from "../../../components/layout/page-links/links";
import browserClient from "../../../utils/axios-client/browser-client";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";
import { instantlyToTop } from "../../../utils/helper-functions/scrollToTopInstantly";
import axios from "axios";

export interface ReviewProps {
  title: string;
  review: string;
  rating: string;
  date: Date;
  user_name: string;
  user_email: string;
  size: string;
  _id: string;
  id_allReviews?: string;
}

export interface AllRatings {
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
  [rating: string]: number;
}

export interface Reviews {
  _id: string;
  productId: string;
  averageRating: number;
  allRatings: AllRatings;
  allReviews: ReviewProps[];
  total: number;
  reviewsByRating?: {
    five: ReviewProps[];
    four: ReviewProps[];
    three: ReviewProps[];
    two: ReviewProps[];
    one: ReviewProps[];
    [rating: string]: ReviewProps[];
  };
}

interface PageProps {
  product: PageProductProps;
  reviews: Reviews;
  editModeItem: boolean;
  isSmall: boolean;
  context: any;
}

const ProductDetailPage: NextPage<PageProps> = ({
  product,
  reviews,
  editModeItem,
  isSmall,
  context,
}) => {
  ////////////
  console.log("context-------------->", context);

  const dispatch = useDispatch();

  const { main_cat, sub_cat, title } = product.productInfo;
  const props = { main_cat, sub_cat, title };

  const client = browserClient();

  const [initialReviewDoc, setInitialReviewDoc] = useState<Reviews>(reviews);
  const [reviewDoc, setReviewDoc] = useState<Reviews>(reviews);

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  if (product === undefined || product === null) {
    return <h1>testing</h1>;
  }

  const refreshReviewsUser = async (pageNum: number, reviewFilter: string) => {
    const { data } = await client.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/products/get-reviews`,
      { productId: product._id, pageNum, filter: reviewFilter, refresh: true }
    );
    if (pageNum === 1 && reviewFilter === "") {
      setInitialReviewDoc(data.reviewDoc);
    }
    setReviewDoc(data.reviewDoc);
  };

  // clear the filter without making another api call
  // set the review back to page 1 reviews
  const resetReviewsUser = () => {
    setReviewDoc(initialReviewDoc);
  };

  return (
    <main className={styles.main_container}>
      <PageLinks {...props} />
      {product ? (
        <ProductDetail
          product={product}
          reviewDoc={reviewDoc}
          editModeItem={editModeItem}
          isSmall={isSmall}
          refreshReviewsUser={refreshReviewsUser}
          resetReviewsUser={resetReviewsUser}
        />
      ) : (
        <h1>No product found</h1>
      )}
    </main>
  );
};

export default ProductDetailPage;

/*
    in /shop/product-detail/[product_id], [product_id] will match anything
    param = context.params?.product_id as string; is used to extract info from the link

    example
    `/shop/product-detail/${p.productInfo.main_cat}-${p.productInfo.sub_cat}-${p._id}`

    I can replace the "sub_cat" as "edit" for the card-edit-modal for small screen
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const param = context.params?.product_id as string;

  const productId = param.slice(param.length - 24);
  // the "main_cat is used to highlight the navbar menu list"
  const main_cat = param.split("_")[0];
  const secondString = param.split("_")[1];

  const editModeItem: boolean = secondString === "edit";
  const isSmall = editModeItem;

  // const client = serverClient(context);

  console.log("context.req.cookies", context.req?.cookies);
  console.log("context.req.headers.cookie", context.req?.headers.cookie);

  try {
    const { data }: { data: PageProps } = await axios({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/products/detail/${productId}`,
      headers: context.req ? context.req.cookies : undefined,
    });

    return {
      props: {
        product: data.product,
        reviews: data.reviews,
        page_cat: main_cat,
        editModeItem,
        isSmall,
        context: {
          productId,
          main_cat,
          secondString,
          cookie_no_head: context.req.cookies,
          cookie: context.req.headers.cookie,
          head: context.req.headers,
        },
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {},
    };
  }
}
