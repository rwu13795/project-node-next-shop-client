import { GetServerSidePropsContext, NextPage } from "next";

import { PageProductProps } from "../../utils/react-hooks/get-more-products";

import ProductDetail from "../../components/shop/product/product-detail";
import serverClient from "../../utils/axios-client/server-client";

interface PageProps {
  product: PageProductProps;
}

const ProductDetailPage: NextPage<PageProps> = ({ product }) => {
  return !product ? (
    <h1>No product found</h1>
  ) : (
    <ProductDetail product={product} />
  );
};

export default ProductDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const productId = context.params?.product_id as string;

  const client = serverClient(context);

  try {
    const { data }: { data: PageProps } = await client.get(
      `http://localhost:5000/api/products/detail/${productId}`
    );

    return {
      props: { product: data.product },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { product: null },
    };
  }
}
