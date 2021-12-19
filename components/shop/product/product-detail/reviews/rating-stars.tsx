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

  const readReviewHandler = () => {
    const elem = document.getElementById("product_reviews");
    if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <Tooltip title={`Read ${total} reviews`}>
      <div className={styles.ratings}>
        <div onClick={readReviewHandler}>
          <div className={empty_stars}></div>
          <div className={full_stars} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </Tooltip>
  );
}

export default memo(RatingStars);
