import React, { useState, Fragment, memo } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

import { Reviews } from "../../../../../pages/shop/product-detail/[product_id]";

// UI //

import { Grid, Tooltip } from "@mui/material";
import styles from "./__rating-stars.module.css";

interface Props {
  averageRating: number;
  total: number;
  large?: boolean;
}

function RatingStars({ averageRating, total, large }: Props): JSX.Element {
  const percentage = (averageRating / 5) * 100;

  const full_stars = large ? styles.full_stars_large : styles.full_stars;
  const empty_stars = large ? styles.empty_stars_large : styles.empty_stars;

  return (
    <Tooltip title={`Read ${total} reviews`}>
      <div className={styles.ratings}>
        <a href="#product_reviews" className={styles.reviews_link}>
          <div className={empty_stars}></div>
          <div className={full_stars} style={{ width: `${percentage}%` }}></div>
        </a>
      </div>
    </Tooltip>
  );
}

export default memo(RatingStars);
