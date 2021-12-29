import React, { useState, memo, useEffect } from "react";

import { ReviewProps } from "../../../../../pages/shop/product-detail/[product_id]";
import { starNum } from "./reviews";

// UI //
import { Grid, Button } from "@mui/material";
import styles from "./__single-review.module.css";
import browserClient from "../../../../../utils/axios-client/browser-client";

interface Props {
  review: ReviewProps;
  reviewPrimaryId: string;
  pageNum: number;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
  setCurrentReviews: React.Dispatch<React.SetStateAction<ReviewProps[]>>;
  clearReviewsFilter: () => void;
  reviewFilter: string;
  page?: string;
  refreshReviewsAdmin?: (
    pageNum: number,
    reviewFilter: string
  ) => Promise<void>;
}

function SingleReview({
  review,
  reviewPrimaryId,
  pageNum,
  reviewFilter,
  refreshReviewsAdmin,
  page,
}: Props): JSX.Element {
  const client = browserClient();

  // the states in "useState" won't be updated immediately
  // if I need to update the states whenever the review object is changed
  // I have to use the "useEffect" on each of this state
  // to ensure the states are updated whenever there is change in the review object

  // since the state "isLong" is depending all the review (Body), "shortText" is
  // depending on "isLong" and so on. I have to update each of these states,
  // "isLong","shortText","body","showMore", one by one using the "useEffect"
  // to ensure the changes are reflected correctly
  const [currentReview, setCurrentReview] = useState<ReviewProps>(review);
  useEffect(() => {
    setCurrentReview(review);
  }, [review]);

  const [isLong, setIsLong] = useState<boolean>(
    currentReview.review.length > 300
  );
  useEffect(() => {
    setIsLong(currentReview.review.length > 300);
  }, [currentReview]);

  const [shortText, setShortText] = useState<string>(
    isLong ? currentReview.review.slice(0, 300) + "..." : currentReview.review
  );
  useEffect(() => {
    setShortText(
      isLong ? currentReview.review.slice(0, 300) + "..." : currentReview.review
    );
  }, [currentReview, isLong]);

  const [body, setBody] = useState<string>(shortText);
  const [showMore, setShowMore] = useState<boolean>(false);
  useEffect(() => {
    setBody(shortText);
    setShowMore(false);
  }, [shortText, currentReview]);

  const showMoreLess = () => {
    if (!showMore) {
      setBody(currentReview.review);
      setShowMore(true);
    } else {
      setBody(shortText);
      setShowMore(false);
    }
  };

  const deleteReviewHandler = async () => {
    // id_allReviews only exists in the "reviewsByRating", so when the reviews are
    // filtered, the "_id" is the "_id" of the "reviewsByRating" review,
    // not the "_id" of the "allReviews"
    let id: string;
    if (currentReview.id_allReviews) {
      id = currentReview.id_allReviews;
    } else {
      id = currentReview._id;
    }
    await client.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/products/delete-review`,
      {
        id_allReviews: id,
        reviewPrimaryId,
        rating: currentReview.rating,
      }
    );

    // refresh the reviews after deleting
    if (refreshReviewsAdmin) {
      refreshReviewsAdmin(pageNum, reviewFilter);
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
        <div className={styles.upper_grid_box_name}>
          {currentReview.user_name}
        </div>
        <div className={styles.upper_grid_box_stars}>
          <div className={styles.stars_container}>
            {Array.from(Array(starNum[currentReview.rating]), (_, i) => i).map(
              (_, i) => {
                return <div key={i}>★</div>;
              }
            )}
          </div>
          <div className={styles.stars_container} style={{ color: "#979797" }}>
            {Array.from(
              Array(5 - starNum[currentReview.rating]),
              (_, i) => i
            ).map((_, i) => {
              return <div key={i}>★</div>;
            })}
          </div>
        </div>
        <div className={styles.upper_grid_box}>
          {new Date(currentReview.date).toDateString()}
        </div>
      </div>

      <div className={styles.lower_grid}>
        <div className={styles.title}>{currentReview.title}</div>
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
          {currentReview.size.toUpperCase()}
        </div>
      </div>
    </Grid>
  );
}

export default memo(SingleReview);
