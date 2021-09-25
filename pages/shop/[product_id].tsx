import axios from "axios";
import { GetStaticPropsContext, NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

import {
  PageProductProps,
  PageColorProps,
} from "../../util/react-hooks/get-more-products";

interface PageProps {
  product: PageProductProps;
}

const ProductDetail: NextPage<PageProps> = ({ product }) => {
  const { productInfo, colorPropsList } = product;
  const [currentColor, setCurrentColor] = useState<PageColorProps>(
    colorPropsList[0]
  );

  return (
    <main>
      <div>product title : {productInfo.title}</div>
      <div>
        {currentColor.imageFiles.map((image, index) => {
          let width, height;
          if (index === 0) {
            width = 400;
            height = 400;
          } else {
            width = 200;
            height = 200;
          }
          return (
            <Image
              key={index}
              src={image}
              alt={productInfo.title}
              width={width}
              height={height}
            />
          );
        })}
      </div>

      <div>{productInfo.price}</div>
      <div>{productInfo.description}</div>
      <div>{colorPropsList[0].sizes!["small"]}</div>
      <div>
        <button>Add to cart</button>
      </div>
      <div>
        {colorPropsList.map((prop, index) => {
          return (
            <button
              onClick={() => {
                setCurrentColor(colorPropsList[index]);
              }}
              key={index}
            >
              {prop.colorName}
            </button>
          );
        })}
      </div>
    </main>
  );
};

export default ProductDetail;

export async function getStaticProps(context: GetStaticPropsContext) {
  const params = context.params?.product_id as string;
  const [productId, category] = params.split("-");

  const { data } = await axios.get<PageProps>(
    `http://localhost:5000/api/products/detail/${category}/${productId}`
  );

  console.log(data.product);

  return {
    props: { product: data.product },
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  // const { data } = await axios.get("http://localhost:8080/shop/products", {
  //   withCredentials: true,
  // });
  // //   console.log(data);
  // const paths = data.map((product) => ({ params: { productId: product._id } }));
  // //   console.log(paths);

  return {
    paths: [],
    fallback: "blocking",
  };
}
