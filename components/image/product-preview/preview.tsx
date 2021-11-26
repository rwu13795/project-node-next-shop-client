import React, {
  useState,
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
} from "react";
import Image from "next/image";
import Link from "next/link";

import {
  PageColorProps,
  PageProductInfo,
} from "../../../utils/react-hooks/get-more-products";
import PreviewColor from "./color-preview";

// UI //
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import styles from "./__preview.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";
import { selectOneItmePerRow } from "../../../utils/redux-store/shopSlice";
import { useRouter } from "next/router";

interface Props {
  colorPropsList: PageColorProps[];
  productInfo: PageProductInfo;
  productId: string;
  page?: string;
}

function ProductPreview({
  colorPropsList,
  productInfo,
  productId,
  page,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const oneItemPerRow = useSelector(selectOneItmePerRow);

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

  const onImageClickHandler = () => {
    dispatch(setPageLoading(true));
    if (page === "admin") {
      router.push(`/admin/add-product?productId=${productId}`);
    } else {
      router.push(productLink);
    }
  };

  return (
    <div className={styles.item_card_box}>
      <div
        className={oneItemPerRow ? styles.image_box_2 : styles.image_box}
        onClick={onImageClickHandler}
      >
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
              productId={productId}
              setPreviewImage={setPreviewImage}
              activeColor={activeColor}
              setActiveIndex={setActiveIndex}
              page={page}
            />
          );
        })}
      </div>
      <div className={styles.item_text}>{title.toUpperCase()}</div>
      <div className={styles.item_text}>$ {price}</div>
    </div>
  );
}

export default memo(ProductPreview);
