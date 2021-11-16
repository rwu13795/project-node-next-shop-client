import React, {
  useState,
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
} from "react";
import Image from "next/image";

import {
  PageColorProps,
  PageProductInfo,
} from "../../../utils/react-hooks/get-more-products";
import PreviewColor from "./color-preview";

// UI //
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import styles from "./__preview.module.css";

interface Props {
  colorPropsList: PageColorProps[];
  productInfo: PageProductInfo;
  productId: string;
}

function ProductPreview({
  colorPropsList,
  productInfo,
  productId,
}: Props): JSX.Element {
  const { title, price, main_cat, sub_cat } = productInfo;
  const initialActiveColor = colorPropsList.map(() => {
    return false;
  });
  const productLink = `/shop/product-detail/${main_cat}-${sub_cat}-${productId}`;

  const [previewImage, setPreviewImage] = useState<string>(
    colorPropsList[0].imageFiles[0]
  );
  const [activeColor, setActiveColor] = useState<boolean[]>(() => {
    let temp = initialActiveColor;
    temp[0] = true;
    return temp;
  });
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // change the activeColor inside the child "PreviewColor" won't change the initial
  // activeColor in the parent untill the second change, which causes a bug that
  // two colors are being set to active. Instead I should setActiveIndex in the child
  // when the parent catch the change in activeIndex, the useEffect below will fire
  // and change the activeColor in the parent level which will be reflected in all children
  useEffect(() => {
    setActiveColor(() => {
      let temp = initialActiveColor;
      temp[activeIndex] = true;
      return temp;
    });
  }, [activeIndex]);

  return (
    <div style={{ marginTop: "60px" }}>
      <div className={styles.image_box}>
        <Image
          src={previewImage}
          alt={previewImage}
          layout="fill"
          loading="eager"
        />
      </div>
      <div className={styles.color_container}>
        {colorPropsList.map((props, index) => {
          return (
            <PreviewColor
              key={index}
              productLink={productLink}
              colorProps={props}
              colorIndex={index}
              setPreviewImage={setPreviewImage}
              activeColor={activeColor}
              initialActiveColor={initialActiveColor}
              setActiveIndex={setActiveIndex}
            />
          );
        })}
      </div>
      <div>{title}</div>
      <div>{price}</div>
    </div>
  );
}

export default memo(ProductPreview);
