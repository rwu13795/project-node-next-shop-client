import { GetServerSidePropsContext, NextPage } from "next";

import { PageProductProps } from "../../../utils/react-hooks/get-more-products";

import ProductDetail from "../../../components/shop/product/product-detail/product-detail";
import serverClient from "../../../utils/axios-client/server-client";

import styles from "./__detail.module.css";

interface PageProps {
  product: PageProductProps;
}

const ProductDetailPage: NextPage<PageProps> = ({ product }) => {
  return !product ? (
    <main>
      <div>HOME/MEN/TOPS/CASUAL SHIRTS FLANNEL</div>
      <h1>No product found</h1>
    </main>
  ) : (
    <main className={styles.main_container}>
      <div>HOME/MEN/TOPS/CASUAL SHIRTS FLANNEL</div>
      <ProductDetail product={product} />
    </main>
  );
};

export default ProductDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const param = context.params?.product_id as string;
  console.log(param);
  const productId = param.slice(param.length - 24);
  const main_cat = param.split("-")[0];

  const client = serverClient(context);

  try {
    const { data }: { data: PageProps } = await client.get(
      `http://localhost:5000/api/products/detail/${productId}`
    );

    return {
      props: { product: data.product, page_cat: main_cat },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { product: null },
    };
  }
}
