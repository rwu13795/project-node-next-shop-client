import React, { useState, Fragment, memo } from "react";

import Image from "next/image";

import browserClient from "../../../../../utils/axios-client/browser-client";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";
import {
  Reviews,
  ReviewProps,
} from "../../../../../pages/shop/product-detail/[product_id]";
import RatingStars from "./rating-stars";
import RatingBars from "./rating-bars";
import SingleReview from "./single-review";
import AddReviewModal from "./add-review";

// UI //
import { Button, Grid, Tooltip } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./__reviews.module.css";

interface Props {
  reviews: Reviews;
  setOpenAddReivewModal: React.Dispatch<React.SetStateAction<boolean>>;
  openAddReivewModal: boolean;
  page?: string;
}

function ProductReviews({
  reviews,
  setOpenAddReivewModal,
  openAddReivewModal,
  page,
}: Props): JSX.Element {
  const {
    averageRating,
    total,
    allReviews,
    allRatings,
    _id: reviewPrimaryId,
    productId,
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
      { reviewPrimaryId, pageNum: newPage, filter: reviewFilter }
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
      { reviewPrimaryId, pageNum: 1, filter: star }
    );
    setPageNum(1);
    setCurrentReviews(data.reviews);
  };

  const clearReviewsFilter = () => {
    setReviewFilter("");
    setPageNum(1);
    setCurrentReviews(allReviews);
  };

  const refreshReviews = async () => {
    const { data } = await client.post(
      "http://localhost:5000/api/products/get-reviews",
      { reviewPrimaryId, pageNum, filter: "" }
    );

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

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            className={_outer_grid}
          >
            <a id="reviews_sub">
              <div className={_sub_title}>
                {num1}-{num2} of{" "}
                {reviewFilter !== "" ? allRatings[reviewFilter] : total} Reviews
              </div>
            </a>
            {reviewFilter !== "" && (
              <Tooltip title="Clear filter">
                <Button
                  variant="outlined"
                  onClick={clearReviewsFilter}
                  className={_filter_button}
                >
                  {starNum[reviewFilter]} Stars{" "}
                  <CancelIcon className={_clear} />
                </Button>
              </Tooltip>
            )}
          </Grid>

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
                  <SingleReview
                    review={review}
                    pageNum={pageNum}
                    reviewPrimaryId={reviewPrimaryId}
                    setPageNum={setPageNum}
                    setCurrentReviews={setCurrentReviews}
                    page={page}
                  />
                </Grid>
              );
            })}
          </Grid>

          {totalReviews > REVIEWS_PER_PAGE && (
            <Grid container justifyContent="center" className={_outer_grid}>
              <Button
                variant="outlined"
                onClick={() => getMoreReviews("prev")}
                disabled={pageNum === 1}
                className={_nav_button}
              >
                <a href="#reviews_sub" className={_link}>
                  ◀
                </a>
              </Button>
              <Button
                variant="outlined"
                onClick={() => getMoreReviews("next")}
                disabled={
                  currentReviews.length < REVIEWS_PER_PAGE || num2 === total
                }
                className={_nav_button}
              >
                <a href="#reviews_sub" className={_link}>
                  ▶
                </a>
              </Button>
            </Grid>
          )}
        </Fragment>
      ) : (
        <h1>No review yet, be the first one to write a review</h1>
      )}

      <AddReviewModal
        openAddReivewModal={openAddReivewModal}
        setOpenAddReivewModal={setOpenAddReivewModal}
        productId={productId}
        refreshReviews={refreshReviews}
      />
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
const _nav_button = styles.reviews_nav_button;
const _filter_button = styles.reviews_filter_button;
const _clear = styles.reviews_clear_filter_icon;
const _link = styles.reviews_sub_link;

export const starNum: {
  five: number;
  four: number;
  three: number;
  two: 2;
  one: number;
  [key: string]: number;
} = { five: 5, four: 4, three: 3, two: 2, one: 1 };
