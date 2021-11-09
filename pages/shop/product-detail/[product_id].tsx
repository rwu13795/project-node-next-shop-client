import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";

import { PageProductProps } from "../../../utils/react-hooks/get-more-products";

import ProductDetail from "../../../components/shop/product/product-detail/product-detail";
import serverClient from "../../../utils/axios-client/server-client";

// UI //
import { Tooltip, Box, IconButton } from "@mui/material";
import styles from "./__detail.module.css";
import PageLinks from "../../../components/layout/page-links/links";

interface ReviewProps {
  title: string;
  review: string;
  rating: string;
  date: Date;
  user_name: string;
  user_email: string;
  size: string;
}

interface AllRatings {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
}

export interface Reviews {
  productId: string;
  averageRating: number;
  allRatings: AllRatings;
  reviews: ReviewProps[];
  total: number;
}

interface PageProps {
  product: PageProductProps;
  reviews: Reviews;
}

const ProductDetailPage: NextPage<PageProps> = ({ product, reviews }) => {
  const { main_cat, sub_cat, title } = product.productInfo;
  const props = { main_cat, sub_cat, title };

  return (
    <main className={styles.main_container}>
      <PageLinks {...props} />
      {product ? (
        <ProductDetail product={product} reviews={reviews} />
      ) : (
        <h1>No product found</h1>
      )}
    </main>
  );
};

export default ProductDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const param = context.params?.product_id as string;
  console.log(param);
  const productId = param.slice(param.length - 24);
  // the "main_cat is used to highlight the navbar menu list"
  const main_cat = param.split("-")[0];

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
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { product: null },
    };
  }
}
