import axios from "axios";
import { GetStaticPropsContext, NextPage } from "next";
import Image from "next/image";
import React, { useState } from "react";

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

interface PageProps {
  product: PageProductProps;
}

const ProductDetail: NextPage<PageProps> = ({ product }) => {
  const { productInfo, colorPropsList } = product;

  const [currentColor, setCurrentColor] = useState<PageColorProps>(
    colorPropsList[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | null>();
  const [quantity, setQuantity] = useState<string>("1");
  const [errors, setErrors] = useState<Errors>({});

  const sizeHandler = (e: React.MouseEvent<HTMLElement>, size: string) => {
    setSelectedSize(size);
    onChangeErrorCheck(inputNames.size, size, setErrors);
  };

  const addToCartHandler = () => {
    console.log(selectedSize, quantity, currentColor.colorName);
    if (!selectedSize) {
      setErrors({ [inputNames.size]: "please select a size" });
      return;
    }
  };

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
        <button onClick={addToCartHandler}>Add to cart</button>
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
      <SelectSize selectedSize={selectedSize} sizeHandler={sizeHandler} />
      {errors[inputNames.size]}
      <SelectQuantity
        quantity={quantity}
        totalQty={selectedSize ? currentColor.sizes![selectedSize] : 0}
        setQuantity={setQuantity}
      />
    </main>
  );
};

export default ProductDetail;

export async function getServerSideProps(context: GetStaticPropsContext) {
  const params = context.params?.product_id as string;
  const [productId, category] = params.split("-");

  const { data } = await axios.get<PageProps>(
    `http://localhost:5000/api/products/detail/${category}/${productId}`
  );

  console.log(data.product);

  return {
    props: { product: data.product },
  };
}
