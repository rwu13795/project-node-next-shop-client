import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  PageProductProps,
  PageColorProps,
} from "../../utils/react-hooks/get-more-products";
import SelectSize from "../../components/shop/select-size";
import SelectQuantity from "../../components/shop/select-quantity";
import {
  Errors,
  onChangeErrorCheck,
} from "../../utils/helper-functions/input-error-check";
import { inputNames } from "../../utils/enums-types/input-names";
import {
  addToCartSession,
  setCsrfToken,
} from "../../utils/redux-store/userSlice";
import ProductDetail from "../../components/shop/product-detail";
import serverClient from "../../utils/axios-client/server-client";

interface PageProps {
  product?: PageProductProps;
}

const ProductDetailPage: NextPage<PageProps> = ({ product }) => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   console.log(csrfToken);
  //   dispatch(setCsrfToken(csrfToken));
  // }, [csrfToken, dispatch]);
  console.log(product);

  return !product ? (
    <h1>No product found</h1>
  ) : (
    <ProductDetail product={product} />
  );
};

export default ProductDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const params = context.params?.product_id as string;
  const [productId, category] = params.split("-");

  const client = serverClient(context);

  try {
    const { data } = await client.get(
      `http://localhost:5000/api/products/detail/${category}/${productId}`
    );

    return {
      props: { product: data?.product },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { product: null },
    };
  }
}
