import {
  Dispatch,
  Fragment,
  SetStateAction,
  useRef,
  useState,
  memo,
} from "react";
import Image from "next/image";
import Link from "next/link";

import ProductPreview from "../../image/product-preview/preview";
import useGetMoreProducts, {
  PageProductProps,
} from "../../../utils/react-hooks/get-more-products";
import useLastElementRef from "../../../utils/react-hooks/last-elem-ref";
import { FilterStats } from "../../../utils/enums-types/categories-interfaces";

// UI //
import {
  Button,
  CircularProgress,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./__sub-cat-list.module.css";

export interface RequestParams {
  pageNum: number;
  filter: {
    sizes: Set<string>;
    colors: Set<string>;
    priceSort?: number;
  };
  filtering: boolean;
}

interface Props {
  startProducts: PageProductProps[];
  startFilterStats: FilterStats;
  sub_cat: string;
  main_cat: string;
}

function SubCatProductsList({
  startProducts,
  startFilterStats,
  main_cat,
  sub_cat,
}: Props): JSX.Element {
  const [params, setParams] = useState<RequestParams>({
    pageNum: 1,
    filter: {
      sizes: new Set<string>(),
      colors: new Set<string>(),
    },
    filtering: false,
  });

  const { isLoading, error, products, filterStats, hasMore } =
    useGetMoreProducts(
      params,
      startProducts,
      startFilterStats,
      main_cat,
      sub_cat
    );

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useLastElementRef(
    isLoading,
    observer,
    hasMore,
    setParams
  );

  const pinkHandler = () => {
    setParams((prev) => {
      let filter = { ...prev.filter };
      filter.colors.add("Black");
      return { ...prev, filter, pageNum: 1, filtering: true };
    });
  };

  const oliveHandler = () => {
    setParams((prev) => {
      let filter = { ...prev.filter };
      filter.colors.add("Olive");
      return { ...prev, filter, pageNum: 1, filtering: true };
    });
  };

  const clearBlackHandler = () => {
    setParams((prev) => {
      let filter = { ...prev.filter };
      filter.colors.delete("Black");
      return { ...prev, filter, pageNum: 1, filtering: true };
    });
  };

  ////
  console.log(filterStats);

  return (
    <Grid container>
      <Grid item container xs={false} md={3}>
        <div style={{ position: "sticky", top: "100px", left: "50px" }}>
          side filter here
        </div>
      </Grid>
      <Grid item container xs={12} md={9}>
        <div>{sub_cat.toUpperCase()}</div>
        <Grid item container>
          {products.map((p, index) => {
            let url = p.colorPropsList[0].imageFiles[0];
            let lastElem = index + 1 === products.length;
            return lastElem ? (
              <Grid
                item
                container
                className={styles.items_grid}
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
                className={styles.items_grid}
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
          })}
          <div>
            <button onClick={pinkHandler}>Black</button>
            <button onClick={clearBlackHandler}>clear Black</button>
            <button onClick={oliveHandler}>Olive</button>
            <button
              onClick={() =>
                setParams({
                  pageNum: 1,
                  filter: {
                    sizes: new Set<string>(),
                    colors: new Set<string>(),
                  },
                  filtering: true,
                })
              }
            >
              Clear filter
            </button>
          </div>
        </Grid>
        {isLoading && (
          <div>
            <h4>Loading shit load of data</h4>
            <CircularProgress />
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default memo(SubCatProductsList);
