import { useRef, useState, memo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

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
  menMenuList,
  womenMenuList,
  kidsMenuList,
} from "../../../utils/enums-types/product-category";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";
import browserClient from "../../../utils/axios-client/browser-client";

// UI //
import { Button, Divider, Grid } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import styles from "./__accessory-tab.module.css";
import styles_2 from "../../../pages/shop/men/__cat.module.css";

interface AccProducts {
  cat_1: PageProductProps[];
  cat_2: PageProductProps[];
  cat_3: PageProductProps[];
}

interface Props {
  main_cat: string;
  startProducts?: AccProducts;
  star_subCatTitles?: string[];
}

function AccessoryTab({
  main_cat,
  startProducts,
  star_subCatTitles,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const client = browserClient();

  const oneItemPerRow = useSelector(selectOneItmePerRow);

  const [products, setProducts] = useState<AccProducts | undefined>(
    startProducts
  );
  const [subCatTitles, setSubCatTitles] = useState<string[] | undefined>(
    star_subCatTitles
  );

  const getAccessories = useCallback(async () => {
    try {
      const { data } = await client.get(
        `http://localhost:5000/api/products/get-accessories?main_cat=${main_cat}`
      );

      setProducts(data.products);
      setSubCatTitles(data.subCatTitles);
    } catch (err) {
      console.log("err in AccessoryTab ---->", err);
    }
  }, [client, main_cat]);

  useEffect(() => {
    if (!products) {
      getAccessories();
    }
  }, [getAccessories, products]);

  const backToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className={styles.main_container}>
      <div className={styles.main_grid}>
        <div className={styles.main_title}></div>
        {products &&
          subCatTitles &&
          Object.values(products).map((cat: PageProductProps[], index) => {
            return (
              <div className={styles.cat_body} key={index}>
                <div className={styles.cat_title}>
                  {subCatTitles[index].toUpperCase()}
                </div>
                <div className={styles.items_container}>
                  {cat.map((prop, index) => {
                    return (
                      <Grid
                        item
                        container
                        className={styles.item_box}
                        md="auto"
                        sm={oneItemPerRow ? 12 : 6}
                        xs={oneItemPerRow ? 12 : 6}
                        key={index + prop.productInfo.title}
                      >
                        <ProductPreview
                          productId={prop._id}
                          colorPropsList={prop.colorPropsList}
                          productInfo={prop.productInfo}
                          oneItemPerRow={oneItemPerRow}
                        />
                      </Grid>
                    );
                  })}
                </div>
              </div>
            );
          })}
        <Button className={styles_2.to_top_button} onClick={backToTopHandler}>
          <ArrowBackIosNewIcon className={styles_2.to_top_icon} />
          back to top
          <ArrowBackIosNewIcon className={styles_2.to_top_icon} />
        </Button>
      </div>
    </main>
  );
}

export default memo(AccessoryTab);
