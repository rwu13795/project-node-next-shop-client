import {
  Dispatch,
  Fragment,
  SetStateAction,
  useRef,
  useState,
  memo,
  useEffect,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

import { setFilterTagToClear } from "../../../utils/redux-store/shopSlice";
import ProductPreview from "../../image/product-preview/preview";
import useGetMoreProducts, {
  PageProductProps,
} from "../../../utils/react-hooks/get-more-products";
import useLastElementRef from "../../../utils/react-hooks/last-elem-ref";
import { FilterStats } from "../../../utils/enums-types/categories-interfaces";
import ProductFilter from "./product-filter/filter";

// UI //
import {
  Button,
  CircularProgress,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
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
  const dispatch = useDispatch();

  const [filterTags, setFilterTags] = useState<Set<string>>(new Set());

  const [params, setParams] = useState<RequestParams>({
    pageNum: 1,
    filter: {
      sizes: new Set<string>(),
      colors: new Set<string>(),
      priceSort: 0,
    },
    filtering: false,
  });

  // since all the sub-cat are using this component, when the sub-cat is changed,
  // the param state has to be reset
  useEffect(() => {
    setParams({
      pageNum: 1,
      filter: {
        sizes: new Set<string>(),
        colors: new Set<string>(),
        priceSort: 0,
      },
      filtering: false,
    });
  }, [sub_cat, startProducts]);

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

  return (
    <Grid container className={styles.main_grid}>
      <Grid item container xs={false} md={3} className={styles.left_grid}>
        <div className={styles.side_bar_container}>
          {filterStats && (
            <ProductFilter
              filterStats={filterStats}
              filterTags={filterTags}
              setParams={setParams}
              setFilterTags={setFilterTags}
            />
          )}
          <div className={styles.side_bar_banner}>
            <Image
              src="/home/men-sm-3.jpg"
              alt="sub-cat"
              width={200}
              height={900}
            />
          </div>
        </div>
      </Grid>
      <Grid item container xs={12} md={9} className={styles.right_grid}>
        <div className={styles.right_grid_upper_container}>
          <div className={styles.sub_cat_title}>{sub_cat.toUpperCase()}</div>
          <div className={styles.main_banner}>
            <Image
              src="/home/men.jpg"
              alt="sub-cat"
              width={1300}
              height={900}
            />
          </div>

          {filterTags.size > 0 && (
            <div>
              {Array.from(filterTags).map((tag) => {
                return (
                  <div key={tag}>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => {
                        dispatch(setFilterTagToClear(tag));
                      }}
                    >
                      {tag}
                      <CancelOutlinedIcon sx={{ ml: "5px" }} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
