import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ProductPreview from "../../image/product-preview/preview";
import useGetMoreProducts, {
  PageProductProps,
} from "../../../utils/react-hooks/get-more-products";
import useLastElementRef from "../../../utils/react-hooks/last-elem-ref";

// UI //
import {
  Button,
  CircularProgress,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./__sub-cat-list.module.css";

interface Props {
  // products: PageProductProps[];
  // isLoading: boolean;
  // lastElementRef: (node: HTMLDivElement) => void;
  startProducts: PageProductProps[];
  sub_cat: string;
  main_cat: string;
}

export default function RenderSubCatImage({
  startProducts,
  main_cat,
  sub_cat,
}: Props) {
  const [pageNum, setPageNum] = useState<number>(1);
  const { isLoading, error, products, hasMore } = useGetMoreProducts(
    pageNum,
    startProducts,
    main_cat,
    sub_cat
  );

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useLastElementRef(
    isLoading,
    observer,
    hasMore,
    setPageNum
  );

  console.log(products);

  return (
    <Fragment>
      <div>t-shirts</div>
      <Grid container className={styles.items_grid}>
        {products.map((p, index) => {
          let url = p.colorPropsList[0].imageFiles[0];
          let lastElem = index + 1 === products.length;
          return lastElem ? (
            <Grid
              item
              container
              // className={styles.inner_grid}
              md={4}
              sm={6}
              xs={6}
              ref={lastElementRef}
              key={index}
            >
              <ProductPreview
                productId={p._id}
                colorPropsList={p.colorPropsList}
                productInfo={p.productInfo}
              />
            </Grid>
          ) : (
            <Grid
              item
              container
              // className={styles.inner_grid}
              md={4}
              sm={6}
              xs={6}
              key={index}
            >
              <ProductPreview
                productId={p._id}
                colorPropsList={p.colorPropsList}
                productInfo={p.productInfo}
              />
            </Grid>
          );
        })}{" "}
      </Grid>
      {isLoading && (
        <div>
          <h4>Loading shit load of data</h4>
          <CircularProgress />
        </div>
      )}
    </Fragment>
  );
}
