import React, { memo } from "react";

import RatingStars from "./rating-stars";

// UI //
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
