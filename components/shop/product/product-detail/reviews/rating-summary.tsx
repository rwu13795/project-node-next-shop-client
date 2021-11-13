import React, { useState, Fragment, memo } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

import { Reviews } from "../../../../../pages/shop/product-detail/[product_id]";
import RatingStars from "./rating-stars";
import AddReviewModal from "./add-review";
// UI //

import { Grid, Tooltip } from "@mui/material";
import styles from "./__rating-stars.module.css";

interface Props {
  productId: string;
  averageRating: number;
  total: number;
}

function RatingSummary({
  averageRating,
  total,
  productId,
}: Props): JSX.Element {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const writeReviewHandler = () => {
    setOpenModal(true);
  };

  return (
    <div className={styles.ratings_container}>
      <div style={{ marginRight: "15px" }}>Reviews:</div>
      <RatingStars averageRating={averageRating} total={total} />
      <div style={{ marginRight: "15px" }}>{`${averageRating} (${total})`}</div>
      <div className={styles.button} onClick={writeReviewHandler}>
        Write a review
      </div>

      <AddReviewModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        productId={productId}
      />
    </div>
  );
}

export default memo(RatingSummary);
