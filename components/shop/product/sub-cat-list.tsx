import { useRef, useState, memo, useEffect } from "react";
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
import { FilterStats } from "../../../utils/enums-types/categories-interfaces";
import ProductFilter from "./product-filter/filter";
import {
  menMenuList,
  womenMenuList,
  kidsMenuList,
} from "../../../utils/enums-types/product-category";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

// UI //
import { Button, Divider, Grid, useMediaQuery } from "@mui/material";
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
  const oneItemPerRow = useSelector(selectOneItmePerRow);

  const isLarge = useMediaQuery("(min-width: 1450px)");
  const isXL = useMediaQuery("(min-width: 1750px)");

  let catListArray: { [key: string]: string[] };
  if (main_cat === "men") {
    catListArray = menMenuList;
  } else if (main_cat === "women") {
    catListArray = womenMenuList;
  } else {
    catListArray = kidsMenuList;
  }
  const banner = `/sub-cat-banner/${main_cat}.jpg`;

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

  const menuClickHandler = () => {
    dispatch(setPageLoading(true));
  };

  return (
    <Grid container className={styles.main_grid}>
      <Grid
        item
        container
        xs={false}
        sm={false}
        md={3}
        lg={3}
        xl={isLarge ? 2 : 3}
        className={styles.left_grid}
      >
        <div className={styles.side_bar_container}>
          <div className={styles.menu_list_container}>
            <div className={styles.menu_title}>
              {main_cat.toUpperCase()} COLLECTION
            </div>
            {Object.keys(catListArray).map((key) => {
              return (
                <div key={key}>
                  <div className={styles.menu_sub_title}>
                    {key.toUpperCase()}
                  </div>
                  <div className={styles.menu_list}>
                    {catListArray[key].map((cat) => {
                      return (
                        <div key={cat} onClick={menuClickHandler}>
                          <Link
                            href={`/shop/${main_cat.toLowerCase()}/${cat.toLowerCase()}`}
                          >
                            <a style={{ textDecoration: "none" }}>
                              <div className={styles.menu_list_item}>{cat}</div>
                            </a>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <Divider />
          {filterStats && (
            <ProductFilter
              filterStats={filterStats}
              filterTags={filterTags}
              setParams={setParams}
              setFilterTags={setFilterTags}
            />
          )}
        </div>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sm={12}
        md={9}
        lg={9}
        xl={isLarge ? 10 : 9}
        className={styles.right_grid}
      >
        <div className={styles.right_grid_upper_container}>
          <div className={styles.sub_cat_title}>{sub_cat.toUpperCase()}</div>
          <div className={styles.main_banner} id="sub_cat_filter_tag">
            <Image
              src={banner}
              alt="sub-cat"
              width={1400}
              height={480}
              blurDataURL={banner}
              placeholder="blur"
            />
          </div>

          <div className={styles.filter_tags}>
            <div className={styles.items_num}>
              {filterStats?.matchingTotal} item
              {filterStats?.matchingTotal && filterStats.matchingTotal > 1
                ? "s"
                : ""}
            </div>
            {filterTags.size > 0 &&
              Array.from(filterTags).map((tag) => {
                return (
                  <Button
                    key={tag}
                    variant="outlined"
                    color="warning"
                    onClick={() => {
                      dispatch(setFilterTagToClear(tag));
                    }}
                    className={styles.filter_tag_button}
                  >
                    {tag}
                    <CancelOutlinedIcon className={styles.filter_tag_icon} />
                  </Button>
                );
              })}
          </div>
        </div>

        <Grid item container>
          {products.map((p, index) => {
            let lastElem = index + 1 === products.length;
            return lastElem ? (
              <Grid
                item
                container
                className={styles.items_grid}
                md={4}
                lg={4}
                xl={isXL ? 3 : 4}
                sm={oneItemPerRow ? 12 : 6}
                xs={oneItemPerRow ? 12 : 6}
                ref={lastElementRef}
                key={index}
              >
                <ProductPreview
                  productId={p._id}
                  colorPropsList={p.colorPropsList}
                  productInfo={p.productInfo}
                  oneItemPerRow={oneItemPerRow}
                />
              </Grid>
            ) : (
              <Grid
                item
                container
                className={styles.items_grid}
                md={4}
                lg={4}
                xl={isXL ? 3 : 4}
                sm={oneItemPerRow ? 12 : 6}
                xs={oneItemPerRow ? 12 : 6}
                key={index}
              >
                <ProductPreview
                  productId={p._id}
                  colorPropsList={p.colorPropsList}
                  productInfo={p.productInfo}
                  oneItemPerRow={oneItemPerRow}
                />
              </Grid>
            );
          })}
        </Grid>
        {products.length < 6 && main_cat !== "men" && filterTags.size < 1 && (
          <div className={styles.hint_box}>
            HINT: Please navigate to the{" "}
            <Link href="/shop/men">Men&apos;s Collections</Link>, there are more
            items in those pages for a thorough testing.
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default memo(SubCatProductsList);
