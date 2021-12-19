import React, { memo } from "react";
import { useDispatch } from "react-redux";

// UI //
import { useMediaQuery, Tooltip } from "@mui/material";
import styles from "./__rating-stars.module.css";
import { setExpandReviewDrawer } from "../../../../../utils/redux-store/shopSlice";

interface Props {
  averageRating: number;
  total: number;
  large?: boolean;
}

function RatingStars({ averageRating, total, large }: Props): JSX.Element {
  const dispatch = useDispatch();
  const isSmall = useMediaQuery("(max-width: 765px)");

  const percentage = (averageRating / 5) * 100;

  const full_stars = large ? styles.full_stars_large : styles.full_stars;
  const empty_stars = large ? styles.empty_stars_large : styles.empty_stars;

  const readReviewHandler = () => {
    const elem = document.getElementById("product_reviews");
    if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
    if (isSmall) {
      dispatch(setExpandReviewDrawer(true));
    }
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
