import React, { useState, memo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import {
  PageColorProps,
  PageProductInfo,
} from "../../../utils/react-hooks/get-more-products";
import PreviewColor from "./color-preview";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

// UI //
import styles from "./__preview.module.css";

interface Props {
  colorPropsList: PageColorProps[];
  productInfo: PageProductInfo;
  productId: string;
  oneItemPerRow?: boolean;
  page?: string;
}

function ProductPreview({
  colorPropsList,
  productInfo,
  productId,
  oneItemPerRow,
  page,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();

  const { title, price, main_cat, sub_cat } = productInfo;
  const initialActiveColor = colorPropsList.map(() => {
    return false;
  });

  const productLink = `/shop/product-detail/${main_cat}_${sub_cat}_${productId}`;

  const [imageBoxStyle, setImageBoxStyle] = useState<string>(styles.image_box);
  const [previewImage, setPreviewImage] = useState<string>(
    colorPropsList[0].imageFiles[0]
  );
  const [activeColor, setActiveColor] = useState<boolean[]>(() => {
    let temp = initialActiveColor;
    temp[0] = true;
    return temp;
  });
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (oneItemPerRow) {
      setImageBoxStyle(styles.image_box_2);
    } else {
      setImageBoxStyle(styles.image_box);
    }
  }, [oneItemPerRow]);

  // I have to reset these states whenever the "colorPropsList, productInfo" were changed
  // otherwise, the info from the previous category will stay unchange until user hovers
  // to the image
  useEffect(() => {
    setPreviewImage(colorPropsList[0].imageFiles[0]);
    setActiveColor(() => {
      let temp = initialActiveColor;
      temp[0] = true;
      return temp;
    });
    setActiveIndex(0);
  }, [colorPropsList]);

  // change the activeColor inside the child "PreviewColor" won't change the initial
  // activeColor in the parent untill the second change, which causes a bug that
  // two colors are being set to active. Instead I should setActiveIndex in the child
  // when the parent catch the change in activeIndex, the useEffect below will trigger
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
    }
  };

  return (
    <div className={styles.item_card_box}>
      <div className={styles.sub_box_container}>
        {page === "admin" ? (
          <div className={imageBoxStyle} onClick={onImageClickHandler}>
            <Image
              src={previewImage}
              alt={previewImage}
              blurDataURL={previewImage}
              width={685}
              height={800}
            />
          </div>
        ) : (
          <Link href={productLink}>
            <a style={{ textDecoration: "none", color: "inherit" }}>
              <div className={imageBoxStyle} onClick={onImageClickHandler}>
                <Image
                  src={previewImage}
                  alt={previewImage}
                  blurDataURL={previewImage}
                  width={685}
                  height={800}
                  placeholder="blur"
                />
              </div>
            </a>
          </Link>
        )}
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
