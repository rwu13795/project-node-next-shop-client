import { useRef, useState, memo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  selectOneItmePerRow,
  setFilterTagToClear,
} from "../../../utils/redux-store/shopSlice";
import ProductPreview from "../../image/product-preview/preview";
import useGetMoreProducts, {
  PageProductProps,
} from "../../../utils/react-hooks/get-more-products";
import useLastElementRef from "../../../utils/react-hooks/last-elem-ref";
import {
  FilterStats,
  MainCat_PageProps,
} from "../../../utils/enums-types/categories-interfaces";
import ProductFilter from "./product-filter/filter";
import {
  menCatArray,
  womenCatArray,
  kidsCatArray,
} from "../../../utils/enums-types/product-category";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

// UI //
import { Button, Divider, Grid, useMediaQuery } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import styles from "./__main-cat-list.module.css";
import { capitalize } from "../../../utils/helper-functions/capitalize-first-letter";

function MainCatProductsList({
  products,
  subCatTitles,
  main_cat,
}: MainCat_PageProps): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();

  const isSmall = useMediaQuery("(max-width: 765px)");

  const dir = `/main-cat-banner/${main_cat}`;
  const catBanners = [
    `${dir}/1.webp`,
    `${dir}/2.webp`,
    `${dir}/3.webp`,
    `${dir}/4.webp`,
  ];

  const title = main_cat.toUpperCase();
  let featuredCat: string[];
  if (main_cat === "men") {
    featuredCat = menCatArray;
  } else if (main_cat === "women") {
    featuredCat = womenCatArray;
  } else {
    featuredCat = kidsCatArray;
  }

  const bannerClickHandler = () => {
    dispatch(setPageLoading(true));
  };

  const buttonClickHandler = (sub_cat: string) => {
    dispatch(setPageLoading(true));
    router.push(`/shop/${main_cat}/${sub_cat}`);
  };

  return (
    <div className={styles.main_grid}>
      <div className={styles.main_title}>
        {title}&apos;{main_cat !== "kids" && "S"} COLLECTIONS
      </div>
      <div className={styles.body_grid}>
        {Object.values(products).map((cat, index) => {
          const banner_grid = (
            <div className={styles.banner_grid}>
              {!isSmall && (
                <div
                  className={styles.sub_title}
                  style={{
                    textAlign: (index + 1) % 2 !== 0 ? "left" : "right",
                  }}
                >
                  {subCatTitles[index].toUpperCase()}
                </div>
              )}

              <div className={styles.banner_box} onClick={bannerClickHandler}>
                <Link
                  href={`/shop/${main_cat}/${subCatTitles[index]}`}
                  passHref
                >
                  <a style={{ textDecoration: "none", color: "inherit" }}>
                    <Image
                      src={catBanners[index]}
                      width={550}
                      alt="cat-banner"
                      height={550}
                    />
                  </a>
                </Link>
                <div className={styles.banner_text}>
                  VIEW ALL {subCatTitles[index].toUpperCase()}
                </div>
              </div>
              <div className={styles.text_filler}>
                {capitalize(subCatTitles[index])} - {textFiller[index]}
              </div>
            </div>
          );

          const images_grid = (
            <div className={styles.images_grid}>
              {cat.map((prop, index) => {
                return (
                  <div
                    key={index + prop.productInfo.title}
                    className={styles.item_box}
                  >
                    <ProductPreview
                      productId={prop._id}
                      colorPropsList={prop.colorPropsList}
                      productInfo={prop.productInfo}
                    />
                  </div>
                );
              })}
            </div>
          );

          let left_grid = (index + 1) % 2 !== 0 ? banner_grid : images_grid;
          let right_grid = (index + 1) % 2 !== 0 ? images_grid : banner_grid;
          if (isSmall) {
            left_grid = banner_grid;
            right_grid = images_grid;
          }
          return (
            <div key={index} className={styles.sub_cat_container}>
              {isSmall && (
                <div className={styles.sub_title}>
                  {subCatTitles[index].toUpperCase()}
                </div>
              )}
              <div className={styles.sub_cat_box}>
                {left_grid}
                {right_grid}
              </div>

              <Button
                variant="outlined"
                className={styles.button_box}
                onClick={() => buttonClickHandler(subCatTitles[index])}
              >
                View all {title}&apos;{main_cat !== "kids" && "S"}{" "}
                {subCatTitles[index]}
              </Button>
            </div>
          );
        })}
        <div className={styles.lower_grid}>
          <div className={styles.sub_title} style={{ textAlign: "center" }}>
            FEATURED COLLECTIONS
          </div>
          <div className={styles.featuredCat_container}>
            {featuredCat.map((cat, index) => {
              let sub_cat = cat.toLowerCase();
              return (
                <div
                  key={cat + index}
                  className={styles.featuredCat_box}
                  onClick={bannerClickHandler}
                >
                  <Link href={`/shop/${main_cat}/${sub_cat}`} passHref>
                    <a style={{ textDecoration: "none", color: "inherit" }}>
                      <Image
                        src={`/sub-cat-featured-image/${main_cat}/${sub_cat}.jpg`}
                        width={200}
                        height={200}
                        alt="banner"
                        className={styles.featuredCat_image}
                      />
                      <div className={styles.cat_text}>{cat}</div>
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MainCatProductsList);

const textFiller = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
];
