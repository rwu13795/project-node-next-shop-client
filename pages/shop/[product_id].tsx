import axios from "axios";
import { GetStaticPropsContext, NextPage } from "next";
import Image from "next/image";
import React, { useState } from "react";
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
} from "../../utils/react-hooks/input-error-check";
import { inputNames } from "../../utils/enums-types/input-names";
import { addToCartSession } from "../../utils/redux-store/userSlice";
import ProductDetail from "../../components/shop/product-detail";

interface PageProps {
  product?: PageProductProps;
}

const Product: NextPage<PageProps> = ({ product }) => {
  return !product ? (
    <h1>No product found</h1>
  ) : (
    <ProductDetail product={product} />
  );
};

export default Product;

export async function getServerSideProps(context: GetStaticPropsContext) {
  const params = context.params?.product_id as string;
  const [productId, category] = params.split("-");

  try {
    const { data } = await axios.get<PageProps | undefined>(
      `http://localhost:5000/api/products/detail/${category}/${productId}`
    );
    console.log(data?.product);

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
