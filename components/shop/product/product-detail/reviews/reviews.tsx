import React, { useState, Fragment, memo } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

import {
  Reviews,
  ReviewProps,
} from "../../../../../pages/shop/product-detail/[product_id]";
import RatingStars from "./rating-stars";
import RatingBars from "./rating-bars";
import SingleReview from "./single-review";

// UI //
import { Grid } from "@mui/material";
import styles from "./__reviews.module.css";
import browserClient from "../../../../../utils/axios-client/browser-client";

interface Props {
  reviews: Reviews;
}

function ProductReviews({ reviews }: Props): JSX.Element {
  const {
    averageRating,
    total,
    allReviews,
    allRatings,
    _id: reviewId,
  } = reviews;
  const client = browserClient();

  const [currentReviews, setCurrentReviews] =
    useState<ReviewProps[]>(allReviews);
  const [pageNum, setPageNum] = useState<number>(1);
  const [reviewFilter, setReviewFilter] = useState<string>("");

  const REVIEWS_PER_PAGE = 6;
  const num1 = pageNum > 1 ? (pageNum - 1) * REVIEWS_PER_PAGE + 1 : pageNum;
  const num2 = (pageNum - 1) * REVIEWS_PER_PAGE + currentReviews.length;

  const ratingKeys = Object.keys(allRatings);
  const totalReviews = reviewFilter !== "" ? allRatings[reviewFilter] : total;

  const getMoreReviews = async (action: string) => {
    let newPage: number;
    if (action === "next") {
      newPage = pageNum + 1;
    } else {
      newPage = pageNum - 1;
    }
    const { data } = await client.post(
      "http://localhost:5000/api/products/get-reviews",
      { reviewId, pageNum: newPage, filter: reviewFilter }
    );
    setPageNum(newPage);
    setCurrentReviews(data.reviews);
  };

  const filterReviews = async (star: string) => {
    if (reviewFilter === star) {
      setReviewFilter("");
      setPageNum(1);
      setCurrentReviews(allReviews);
      return;
    }

    setReviewFilter(star);
    const { data } = await client.post(
      "http://localhost:5000/api/products/get-reviews",
      { reviewId, pageNum: 1, filter: star }
    );
    setPageNum(1);
    setCurrentReviews(data.reviews);
  };

  return (
    <Grid container justifyContent="center" className={_container}>
      {reviews.total > 0 ? (
        <Fragment>
          <div className={_title}>
            <a id="product_reviews">
              <h1>Reviews</h1>
            </a>
          </div>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={_outer_grid}
          >
            <Grid
              container
              item
              justifyContent="center"
              md={12}
              lg={6}
              className={_box}
            >
              <div>
                <div className={styles.reviews_desc_box}>
                  <div>Average Customer Rating: {averageRating}</div>
                </div>
                <div className={styles.reviews_desc_box}>
                  <RatingStars
                    averageRating={averageRating}
                    total={total}
                    large={true}
                  />
                  <div>{total} Reviews</div>
                </div>
              </div>
            </Grid>

            <Grid
              container
              item
              justifyContent="center"
              md={12}
              lg={6}
              className={_box}
            >
              <Grid
                container
                item
                direction="column"
                justifyContent="center"
                alignItems="center"
                className={_rating_bars}
              >
                Select a row below to filter reviews
                {ratingKeys.map((star, index) => {
                  return (
                    <RatingBars
                      key={index}
                      ratingNum={allRatings[star]}
                      star={star}
                      index={index}
                      total={total}
                      reviewFilter={reviewFilter}
                      setReviewFilter={setReviewFilter}
                      filterReviews={filterReviews}
                    />
                  );
                })}
              </Grid>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" className={_outer_grid}>
            <div className={_sub_title}>
              {num1}-{num2} of{" "}
              {reviewFilter !== "" ? allRatings[reviewFilter] : total} Reviews
            </div>
          </Grid>

          {reviewFilter !== "" && (
            <Grid container justifyContent="center" className={_outer_grid}>
              <div>{starNum[reviewFilter]} Stars </div>
            </Grid>
          )}

          <Grid container justifyContent="center" className={_outer_grid}>
            {currentReviews.map((review, index) => {
              return (
                <Grid
                  container
                  item
                  justifyContent="center"
                  key={index}
                  md={12}
                  lg={6}
                  className={_box}
                >
                  <SingleReview review={review} />
                </Grid>
              );
            })}
          </Grid>

          {totalReviews > REVIEWS_PER_PAGE && (
            <Grid container justifyContent="center" className={_outer_grid}>
              <button
                onClick={() => getMoreReviews("prev")}
                disabled={pageNum === 1}
              >
                prev
              </button>
              <button
                onClick={() => getMoreReviews("next")}
                disabled={currentReviews.length < REVIEWS_PER_PAGE}
              >
                next
              </button>
            </Grid>
          )}
        </Fragment>
      ) : (
        <h1>No review yet, be the first one to write a review</h1>
      )}
    </Grid>
  );
}

export default memo(ProductReviews);

const _container = styles.main_container;
const _box = styles.inner_grid_box;
const _outer_grid = styles.outer_grid_box;
const _title = styles.title_box;
const _sub_title = styles.sub_title_box;
const _rating_bars = styles.rating_bars_container;
const starNum = { five: 5, four: 4, three: 3, two: 2, one: 1 } as {
  [key: string]: number;
};
