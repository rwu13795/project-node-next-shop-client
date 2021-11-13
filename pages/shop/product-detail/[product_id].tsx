import { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";
import Link from "next/link";

import { PageProductProps } from "../../../utils/react-hooks/get-more-products";

import ProductDetail from "../../../components/shop/product/product-detail/product-detail";
import serverClient from "../../../utils/axios-client/server-client";

// UI //
import { Tooltip, Box, IconButton } from "@mui/material";
import styles from "./__detail.module.css";
import PageLinks from "../../../components/layout/page-links/links";
import browserClient from "../../../utils/axios-client/browser-client";

export interface ReviewProps {
  title: string;
  review: string;
  rating: string;
  date: Date;
  user_name: string;
  user_email: string;
  size: string;
  _id: string;
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
  editMode: boolean;
  isSmall: boolean;
}

const ProductDetailPage: NextPage<PageProps> = ({
  product,
  reviews,
  editMode,
  isSmall,
}) => {
  const { main_cat, sub_cat, title } = product.productInfo;
  const props = { main_cat, sub_cat, title };
  const client = browserClient();

  const [reviewDoc, setReviewDoc] = useState<Reviews>(reviews);

  const refreshReviews = async () => {
    const { data } = await client.post(
      "http://localhost:5000/api/products/get-reviews",
      { productId: product._id, pageNum: 1, filter: "", refresh: true }
    );
    setReviewDoc(data.reviewDoc);
  };

  return (
    <main className={styles.main_container}>
      <PageLinks {...props} />
      {product ? (
        <ProductDetail
          product={product}
          reviewDoc={reviewDoc}
          editMode={editMode}
          isSmall={isSmall}
          refreshReviews={refreshReviews}
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
  console.log(param);
  const productId = param.slice(param.length - 24);
  // the "main_cat is used to highlight the navbar menu list"
  const main_cat = param.split("-")[0];
  const secondString = param.split("-")[1];

  const editMode: boolean = secondString === "edit";
  const isSmall = editMode;

  const client = serverClient(context);

  try {
    const { data }: { data: PageProps } = await client.get(
      `http://localhost:5000/api/products/detail/${productId}`
    );

    return {
      props: {
        product: data.product,
        reviews: data.reviews,
        page_cat: main_cat,
        editMode,
        isSmall,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { product: null },
    };
  }
}
