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

function SelectSize({
  selectedSize,
  currentColor,
  sizeHandler,
}: Props): JSX.Element {
  return (
    <div className={styles.sizes_container}>
      <ToggleButtonGroup
        value={selectedSize}
        exclusive
        onChange={sizeHandler}
        aria-label="select a size"
      >
        <ToggleButtonStyled
          value="small"
          aria-label="small"
          disabled={currentColor.sizes["small"] <= 0}
          className={styles.toggle_button}
        >
          small
        </ToggleButtonStyled>
        <ToggleButtonStyled
          value="medium"
          aria-label="medium"
          disabled={currentColor.sizes["medium"] <= 0}
          className={styles.toggle_button}
        >
          Medium
        </ToggleButtonStyled>
        <ToggleButtonStyled
          value="large"
          aria-label="large"
          disabled={currentColor.sizes["large"] <= 0}
          className={styles.toggle_button}
        >
          Large
        </ToggleButtonStyled>
      </ToggleButtonGroup>
    </div>
  );
}

export default memo(SelectSize);

/* Old method to create custom style */

// const useStyles = makeStyles({
//   buttonColor: {
//     "&.Mui-selected": {
//       backgroundColor: "black",
//       color: "#ffffff",
//       "&:hover": { backgroundColor: "grey" },
//       "&:active": { backgroundColor: "silver" },
//     },
//     "&:hover": {
//       backgroundColor: "grey",
//       color: "white",
//     },
//     "&:active": {
//       backgroundColor: "brown",
//     },
//   },
// });
