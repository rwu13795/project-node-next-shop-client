import React, { useState, Fragment, memo } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

import { Reviews } from "../../../../../pages/shop/product-detail/[product_id]";
import RatingStars from "./rating-stars";
import AddReviewModal from "./add-review";
// UI //

import { Grid, Tooltip } from "@mui/material";
import styles from "./__rating-stars.module.css";

interface Props {
  averageRating: number;
  total: number;
  setOpenAddReivewModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function RatingSummary({
  averageRating,
  total,
  setOpenAddReivewModal,
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
      <div
        className={styles.button}
        onClick={() => setOpenAddReivewModal(true)}
      >
        Write a review
      </div>
    </div>
  );
}

export default memo(RatingSummary);
