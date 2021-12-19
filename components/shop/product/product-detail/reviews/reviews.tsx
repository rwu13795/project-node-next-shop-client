import React, {
  useState,
  Fragment,
  memo,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

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
  reviewDoc: Reviews;
  openAddReivewModal: boolean;
  page?: string;
  editMode?: boolean;
  stayOnPage?: number;
  stayOnFilter?: string;
  setOpenAddReivewModal?: React.Dispatch<React.SetStateAction<boolean>>;
  refreshReviewsUser?: (pageNum: number, reviewFilter: string) => Promise<void>;
  resetReviewsUser?: () => void;
  refreshReviewsAdmin?: (
    pageNum: number,
    reviewFilter: string
  ) => Promise<void>;
}

function ProductReviews({
  reviewDoc,
  openAddReivewModal,
  page,
  editMode,
  stayOnPage,
  stayOnFilter,
  setOpenAddReivewModal,
  refreshReviewsUser,
  resetReviewsUser,
  refreshReviewsAdmin,
}: Props): JSX.Element {
  const [currentReviews, setCurrentReviews] = useState<ReviewProps[]>(
    reviewDoc.allReviews
  );
  const [pageNum, setPageNum] = useState<number>(1);
  const [reviewFilter, setReviewFilter] = useState<string>("");

  useEffect(() => {
    setCurrentReviews(reviewDoc.allReviews);
    if (editMode) {
      setPageNum(stayOnPage ? stayOnPage : 1);
      setReviewFilter(stayOnFilter ? stayOnFilter : "");
    }
  }, [stayOnPage, stayOnFilter, editMode, reviewDoc]);

  const REVIEWS_PER_PAGE = 6;
  const num1 = pageNum > 1 ? (pageNum - 1) * REVIEWS_PER_PAGE + 1 : pageNum;
  const num2 = (pageNum - 1) * REVIEWS_PER_PAGE + currentReviews.length;

  const ratingKeys = Object.keys(reviewDoc.allRatings);
  const totalReviews =
    reviewFilter !== "" ? reviewDoc.allRatings[reviewFilter] : reviewDoc.total;

  const getMoreReviews = async (action: string) => {
    let newPage: number;
    if (action === "next") {
      newPage = pageNum + 1;
    } else {
      newPage = pageNum - 1;
    }

    // have to branch here, the Admin edit-review use different logic
    if (editMode && refreshReviewsAdmin) {
      await refreshReviewsAdmin(newPage, reviewFilter);
    } else {
      if (refreshReviewsUser) {
        await refreshReviewsUser(newPage, reviewFilter);
        setPageNum(newPage);
      }
    }
  };

  const filterReviews = async (star: string) => {
    if (reviewFilter === star) {
      clearReviewsFilter();
    } else {
      // only return the fisrt page of the filtered reviews, not the entire reviewDoc
      setReviewFilter(star);
      // const { data } = await client.post(
      //   "http://localhost:5000/api/products/get-reviews",
      //   { productId, pageNum: 1, filter: star, refresh: false }
      // );
      // setPageNum(1);
      // setCurrentReviews(data.reviews);
      if (refreshReviewsUser) {
        await refreshReviewsUser(1, star);
        setPageNum(1);
      }
      if (refreshReviewsAdmin) {
        await refreshReviewsAdmin(1, star);
        setPageNum(1);
      }
    }
  };

  const clearReviewsFilter = async () => {
    if (editMode && refreshReviewsAdmin) {
      // have to make an api call in the the Admin component for clearing the filter
      // because the "initialDoc" is still keeping the deleted review
      // can't use the "initialDoc" in the Admin component
      await refreshReviewsAdmin(1, "");
    }
    if (resetReviewsUser) {
      resetReviewsUser();
    }

    setReviewFilter("");
    setPageNum(1);
  };

  const writeReviewHandler = () => {
    if (setOpenAddReivewModal) {
      setOpenAddReivewModal(true);
    }
  };

  const scrollToReviewsSub = () => {
    const elem = document.getElementById("reviews_sub");
    if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <Grid
      container
      justifyContent="center"
      className={page === "admin" ? _container_admin : _container}
    >
      {reviewDoc.total > 0 ? (
        <Fragment>
          <div className={_title}>
            <a id="product_reviews">
              <h1>Reviews</h1>
            </a>
            {page !== "admin" && (
              <Button variant="outlined" onClick={writeReviewHandler}>
                Write a review
              </Button>
            )}
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
                  <div>Average Customer Rating: {reviewDoc.averageRating}</div>
                </div>
                <div className={styles.reviews_desc_box}>
                  <RatingStars
                    averageRating={reviewDoc.averageRating}
                    total={reviewDoc.total}
                    large={true}
                  />
                  <div>{reviewDoc.total} Reviews</div>
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
                      ratingNum={reviewDoc.allRatings[star]}
                      star={star}
                      index={index}
                      total={reviewDoc.total}
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
            <div className={_sub_title} id="reviews_sub">
              {num1}-{num2} of{" "}
              {reviewFilter !== ""
                ? reviewDoc.allRatings[reviewFilter]
                : reviewDoc.total}{" "}
              Reviews
            </div>

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
                    reviewPrimaryId={reviewDoc._id}
                    setPageNum={setPageNum}
                    setCurrentReviews={setCurrentReviews}
                    refreshReviewsAdmin={refreshReviewsAdmin}
                    clearReviewsFilter={clearReviewsFilter}
                    reviewFilter={reviewFilter}
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
                <span onClick={scrollToReviewsSub}>◀</span>
              </Button>
              <Button
                variant="outlined"
                onClick={() => getMoreReviews("next")}
                disabled={
                  currentReviews.length < REVIEWS_PER_PAGE ||
                  (reviewFilter !== ""
                    ? num2 === reviewDoc.allRatings[reviewFilter]
                    : num2 === reviewDoc.total)
                }
                className={_nav_button}
              >
                <span onClick={scrollToReviewsSub}>▶</span>
              </Button>
            </Grid>
          )}
        </Fragment>
      ) : (
        <div className={_no_review}>
          {page === "admin" ? (
            <div>There is no review for this product</div>
          ) : (
            <Fragment>
              <div>No review yet, be the first one to</div>
              <Button
                variant="outlined"
                onClick={writeReviewHandler}
                className={_write_button}
              >
                Write a review
              </Button>
            </Fragment>
          )}
        </div>
      )}

      <AddReviewModal
        openAddReivewModal={openAddReivewModal}
        setOpenAddReivewModal={setOpenAddReivewModal}
        productId={reviewDoc.productId}
        refreshReviewsUser={refreshReviewsUser}
        setReviewFilter={setReviewFilter}
        setPageNum={setPageNum}
      />
    </Grid>
  );
}

export default memo(ProductReviews);

const _container = styles.main_container;
const _container_admin = styles.main_container_admin;
const _box = styles.inner_grid_box;
const _outer_grid = styles.outer_grid_box;
const _title = styles.title_box;
const _sub_title = styles.sub_title_box;
const _rating_bars = styles.rating_bars_container;
const _nav_button = styles.reviews_nav_button;
const _filter_button = styles.reviews_filter_button;
const _clear = styles.reviews_clear_filter_icon;
const _link = styles.reviews_sub_link;
const _no_review = styles.no_review;
const _write_button = styles.write_button;

export const starNum: {
  five: number;
  four: number;
  three: number;
  two: 2;
  one: number;
  [key: string]: number;
} = { five: 5, four: 4, three: 3, two: 2, one: 1 };
