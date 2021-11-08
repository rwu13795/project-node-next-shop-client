import React, { useState, memo } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

// UI //
import { ToggleButtonStyled } from "../../../../../styles/mui-custom-components";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import styles from "./__sizes.module.css";

interface Props {
  selectedSize: string;
  currentColor: PageColorProps;
  sizeHandler: (event: React.MouseEvent<HTMLElement>, size: string) => void;
}

function ProductReview({
  selectedSize,
  currentColor,
  sizeHandler,
}: Props): JSX.Element {
  return <div className={""}></div>;
}

export default memo(ProductReview);
