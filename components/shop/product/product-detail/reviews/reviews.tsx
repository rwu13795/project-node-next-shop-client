import React, { useState, Fragment, memo } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

import { Reviews } from "../../../../../pages/shop/product-detail/[product_id]";

// UI //

import { Grid } from "@mui/material";
import styles from "./__reviews.module.css";

interface Props {
  reviews: Reviews;
}

function ProductReviews({ reviews }: Props): JSX.Element {
  const _box = styles.inner_grid_box;
  const _inner_grid = styles.inner_grid;
  const _lower_grid = styles._lower_grid;

  return (
    <main className={styles.main_grid}>
      {reviews.total > 0 ? (
        <Fragment>
          <div className={_inner_grid}>
            <div className={_box}>{reviews.averageRating}</div>
            <div className={_box}>{reviews.allRatings.five}</div>
          </div>
          <div className={_inner_grid}>
            {reviews.reviews.map((r, index) => {
              return (
                <div key={index} className={_box}>
                  <div>{r.user_name}</div>
                  <div>{r.title}</div>
                  <div>{r.review}</div>
                </div>
              );
            })}
          </div>
        </Fragment>
      ) : (
        <h1>No Review</h1>
      )}
    </main>
  );
}

export default memo(ProductReviews);
