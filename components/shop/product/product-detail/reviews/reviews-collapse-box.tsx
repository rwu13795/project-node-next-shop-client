import React, { useState, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectExpandReviewDrawer,
  setExpandReviewDrawer,
} from "../../../../../utils/redux-store/shopSlice";
import ProductReviews from "./reviews";
import { Reviews } from "../../../../../pages/shop/product-detail/[product_id]";

// UI //
import {
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  Grid,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import styles from "./__reviews-collapse-box.module.css";

interface Props {
  reviewDoc: Reviews;
  setOpenAddReivewModal: React.Dispatch<React.SetStateAction<boolean>>;
  openAddReivewModal: boolean;
  page?: string;
  refreshReviewsUser?: (pageNum: number, reviewFilter: string) => Promise<void>;
  resetReviewsUser?: () => void;
}

function ReviewsCollapseBox({
  reviewDoc,
  openAddReivewModal,
  page,
  setOpenAddReivewModal,
  refreshReviewsUser,
  resetReviewsUser,
}: Props): JSX.Element {
  const [expand, setExpand] = useState<boolean>(false);
  const dispatch = useDispatch();
  const expandReviewDrawer = useSelector(selectExpandReviewDrawer);

  useEffect(() => {
    if (openAddReivewModal) {
      setExpand(true);
    }
  }, [openAddReivewModal]);

  useEffect(() => {
    if (expandReviewDrawer) {
      setExpand(true);
      // wait for the review drawer to fully expand, so that
      // the reviews can be scrolled to top
      const timer = setTimeout(() => {
        const elem = document.getElementById("reviews_drawer");
        if (elem) elem.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 300);
      return () => {
        dispatch(setExpandReviewDrawer(false));
        clearTimeout(timer);
      };
    }
  }, [expandReviewDrawer, dispatch]);

  const toggleExpand = () => {
    setExpand((prev) => !prev);
    dispatch(setExpandReviewDrawer(!expandReviewDrawer));
  };

  return (
    <Grid sx={{ width: "90vw" }} id="reviews_drawer">
      <ListItemButton onClick={toggleExpand} className={styles.collapse_box}>
        <ListItemText primary="REVIEWS" />
        {expand ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Divider />

      <Collapse in={expand} timeout="auto" unmountOnExit>
        <ProductReviews
          reviewDoc={reviewDoc}
          page={page}
          refreshReviewsUser={refreshReviewsUser}
          resetReviewsUser={resetReviewsUser}
          setOpenAddReivewModal={setOpenAddReivewModal}
          openAddReivewModal={openAddReivewModal}
        />
        <Divider />
      </Collapse>
    </Grid>
  );
}

export default memo(ReviewsCollapseBox);
