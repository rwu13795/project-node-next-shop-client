import React, { useState, Fragment, memo } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

import {
  AllRatings,
  Reviews,
} from "../../../../../pages/shop/product-detail/[product_id]";

// UI //
import { Grid, Tooltip } from "@mui/material";
import styles from "./__rating-bars.module.css";

interface Props {
  ratingNum: number;
  star: string;
  index: number;
  total: number;
  reviewFilter: string;
  setReviewFilter: React.Dispatch<React.SetStateAction<string>>;
  filterReviews: (star: string) => Promise<void>;
}

function RatingBars({
  ratingNum,
  star,
  index,
  total,
  reviewFilter,
  setReviewFilter,
  filterReviews,
}: Props): JSX.Element {
  const container =
    ratingNum > 0
      ? styles.bars_detail_container
      : styles.bars_detail_container_empty;

  const setFilter = async () => {
    if (ratingNum < 1) return;
    await filterReviews(star);
  };

  return (
    <Grid item className={styles.main_container}>
      <div className={container} onClick={setFilter}>
        {5 - index}
        <div style={{ fontSize: "22px" }}>★</div>
        <div className={styles.outer_bars}>
          <div
            className={styles.inner_bars}
            style={{ width: `${(ratingNum / total) * 250}px` }}
          ></div>
        </div>
        {ratingNum}
      </div>
    </Grid>
  );
}

export default memo(RatingBars);
