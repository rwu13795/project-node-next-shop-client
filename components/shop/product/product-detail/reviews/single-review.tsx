import React, { useState, Fragment, memo } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

import {
  ReviewProps,
  Reviews,
} from "../../../../../pages/shop/product-detail/[product_id]";

// UI //

import { Grid, Tooltip } from "@mui/material";
import styles from "./__rating-stars.module.css";

interface Props {
  review: ReviewProps;
}

function SingleReview({ review }: Props): JSX.Element {
  const shortText = review.review.slice(100) + "...";
  const [body, setBody] = useState<string>();

  return (
    <Fragment>
      <div>{review.user_name}</div>
      <div>{review.title}</div>
      <div>{review.review}</div>
    </Fragment>
  );
}

export default memo(SingleReview);
