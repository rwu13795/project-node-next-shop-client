import React, { useState, Fragment, memo, useEffect } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

import {
  ReviewProps,
  Reviews,
} from "../../../../../pages/shop/product-detail/[product_id]";
import { starNum } from "./reviews";

// UI //
import { Grid, Tooltip, Button } from "@mui/material";
import styles from "./__single-review.module.css";
import { style } from "@mui/system";
import browserClient from "../../../../../utils/axios-client/browser-client";

interface Props {
  review: ReviewProps;
  reviewPrimaryId: string;
  pageNum: number;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
  setCurrentReviews: React.Dispatch<React.SetStateAction<ReviewProps[]>>;
  page?: string;
}

function SingleReview({
  review: reviewObject,
  reviewPrimaryId,
  pageNum,
  setPageNum,
  setCurrentReviews,
  page,
}: Props): JSX.Element {
  const {
    user_name,
    rating,
    date,
    title,
    review,
    size,
    _id: id_allReviews,
  } = reviewObject;
  const client = browserClient();

  const isLong = review.length > 300;
  const shortText = isLong ? review.slice(0, 300) + "..." : review;
  const [body, setBody] = useState<string>("");
  const [showMore, setShowMore] = useState<boolean>(false);

  // there are some weird behaviors where the body will retain the last review body
  // after I fetched more reviews and update this SingleReview component
  // all the props passed from the parent are updated, but somehow, the "body" and "showMore"
  // retained the old values and won't update automatically
  // I have to manually use the "useEffect" to update the review body
  useEffect(() => {
    setBody(shortText);
    setShowMore(false);
  }, [shortText]);

  const showMoreLess = () => {
    if (!showMore) {
      setBody(review);
      setShowMore(true);
    } else {
      setBody(shortText);
      setShowMore(false);
    }
  };

  const deleteReviewHandler = async () => {
    await client.post("http://localhost:5000/api/products/delete-review", {
      id_allReviews,
      reviewPrimaryId,
      rating,
    });

    // refresh the reviews after deleting
    const { data } = await client.post(
      "http://localhost:5000/api/products/get-reviews",
      { reviewPrimaryId, pageNum, filter: "" }
    );
    if (data.reviews.length > 0) {
      setCurrentReviews(data.reviews);
    } else {
      if (pageNum > 1) {
        const { data } = await client.post(
          "http://localhost:5000/api/products/get-reviews",
          { reviewPrimaryId, pageNum: pageNum - 1, filter: "" }
        );
        setPageNum((prev) => prev - 1);
        setCurrentReviews(data.reviews);
      }
    }
  };

  return (
    <Grid className={styles.main_grid}>
      {page === "admin" && (
        <Button variant="outlined" color="error" onClick={deleteReviewHandler}>
          Delete
        </Button>
      )}

      <div className={styles.upper_grid}>
        <div className={styles.upper_grid_box_name}>{user_name}</div>
        <div className={styles.upper_grid_box_stars}>
          <div className={styles.stars_container}>
            {Array.from(Array(starNum[rating]), (_, i) => i).map((_, i) => {
              return <div key={i}>★</div>;
            })}
          </div>
          <div className={styles.stars_container} style={{ color: "#979797" }}>
            {Array.from(Array(5 - starNum[rating]), (_, i) => i).map((_, i) => {
              return <div key={i}>★</div>;
            })}
          </div>
        </div>
        <div className={styles.upper_grid_box}>
          {new Date(date).toDateString()}
        </div>
      </div>

      <div className={styles.lower_grid}>
        <div className={styles.title}>{title}</div>
        <div className={styles.body}>
          {body}
          {isLong &&
            (showMore ? (
              <Button
                variant="outlined"
                onClick={showMoreLess}
                className={styles.show_more_button}
              >
                show less
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={showMoreLess}
                className={styles.show_more_button}
              >
                read more
              </Button>
            ))}
        </div>
        <div className={styles.size_box}>
          <span className={styles.size}>Purchased size</span>
          {size.toUpperCase()}
        </div>
      </div>
    </Grid>
  );
}

export default memo(SingleReview);
