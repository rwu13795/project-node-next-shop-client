import React, { useState, Fragment, memo } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

import { Reviews } from "../../../../../pages/shop/product-detail/[product_id]";
import RatingStars from "./rating-stars";
// UI //

import { Grid, Tooltip } from "@mui/material";
import styles from "./__rating-stars.module.css";

interface Props {
  averageRating: number;
  total: number;
}

function RatingSummary({ averageRating, total }: Props): JSX.Element {
  return (
    <div className={styles.ratings_container}>
      <div style={{ marginRight: "15px" }}>Reviews:</div>
      <RatingStars averageRating={averageRating} total={total} />
      <div style={{ marginRight: "15px" }}>{`${averageRating} (${total})`}</div>
      <div className={styles.button}>Write a review</div>
    </div>
  );
}

export default memo(RatingSummary);
