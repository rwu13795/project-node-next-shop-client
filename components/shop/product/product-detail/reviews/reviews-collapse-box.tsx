import React, { Fragment, useState, memo } from "react";

import ProductReviews from "./reviews";
import { Reviews } from "../../../../../pages/shop/product-detail/[product_id]";

// UI //
import {
  Drawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Collapse,
  Divider,
  Grid,
  Box,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import styles from "./__reviews-collapse-box.module.css";

interface Props {
  reviews: Reviews;
  setOpenAddReivewModal: React.Dispatch<React.SetStateAction<boolean>>;
  openAddReivewModal: boolean;
  page?: string;
}

function ReviewsCollapseBox({
  reviews,
  setOpenAddReivewModal,
  openAddReivewModal,
  page,
}: Props): JSX.Element {
  const [expand, setExpand] = useState<boolean>(false);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <Grid sx={{ width: "90vw" }}>
      {/* <Divider /> */}
      <ListItemButton onClick={toggleExpand} className={styles.collapse_box}>
        <ListItemText primary="REVIEWS" />
        {expand ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Divider />

      <Collapse in={expand} timeout="auto" unmountOnExit>
        <ProductReviews
          reviews={reviews}
          page={page}
          setOpenAddReivewModal={setOpenAddReivewModal}
          openAddReivewModal={openAddReivewModal}
        />
        <Divider />
      </Collapse>
    </Grid>
  );
}

export default memo(ReviewsCollapseBox);
