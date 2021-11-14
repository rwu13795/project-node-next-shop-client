import React, {
  useState,
  Fragment,
  memo,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
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
  clearReviewsFilter: () => void;
  reviewFilter: string;
  page?: string;
  refreshReviewsAdmin?: (
    pageNum: number,
    reviewFilter: string
  ) => Promise<void>;
}

function SingleReview({
  review: reviewObject,
  reviewPrimaryId,
  pageNum,
  reviewFilter,
  refreshReviewsAdmin,
  page,
}: Props): JSX.Element {
  const { user_name, rating, date, title, review, size, _id, id_allReviews } =
    reviewObject;
  const client = browserClient();

  const [isLong, setIsLong] = useState<boolean>(review.length > 300);
  const [shortText, setShortText] = useState<string>(
    isLong ? review.slice(0, 300) + "..." : review
  );
  const [body, setBody] = useState<string>(shortText);
  const [showMore, setShowMore] = useState<boolean>(false);

  // there are some weird behaviors where the body will retain the last review body
  // if the new and old reviews are literally the same, then it won't update the
  // component (it happens when I put the same review body in different reviews )
  useEffect(() => {
    /*
    setIsLong(review.length > 300);
    setShortText(review.length > 300 ?  review.slice(0, 300) + "..." : review);
    */
    setBody(shortText);
    setShowMore(false);
  }, [review, shortText]);

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
    // id_allReviews only exists in the "reviewsByRating", so when the reviews are
    // filtered, the "_id" is the "_id" of the "reviewsByRating" review,
    // not the "_id" of the "allReviews"
    let id: string;
    if (id_allReviews) {
      id = id_allReviews;
    } else {
      id = _id;
    }
    await client.post("http://localhost:5000/api/products/delete-review", {
      id_allReviews: id,
      reviewPrimaryId,
      rating,
    });

    // refresh the reviews after deleting
    if (refreshReviewsAdmin) {
      console.log("deleting review");
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
