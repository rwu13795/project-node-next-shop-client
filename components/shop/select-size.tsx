import React, { useState } from "react";
import ToggleButton, { ToggleButtonProps } from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { styled } from "@mui/material/styles";
import { theme } from "../../styles/mui-theme";
import { ToggleButtonStyled } from "../../styles/mui-custom-styled-components";
import { PageColorProps } from "../../utils/react-hooks/get-more-products";

interface Props {
  selectedSize: string;
  currentColor: PageColorProps;
  sizeHandler: (event: React.MouseEvent<HTMLElement>, size: string) => void;
}

export default function SelectSize({
  selectedSize,
  currentColor,
  sizeHandler,
}: Props): JSX.Element {
  console.log("size editMode", selectedSize);

  return (
    <div>
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
        >
          small
        </ToggleButtonStyled>
        <ToggleButtonStyled
          value="medium"
          aria-label="medium"
          disabled={currentColor.sizes["medium"] <= 0}
        >
          Medium
        </ToggleButtonStyled>
        <ToggleButtonStyled
          value="large"
          aria-label="large"
          disabled={currentColor.sizes["large"] <= 0}
        >
          Large
        </ToggleButtonStyled>
      </ToggleButtonGroup>
    </div>
  );
}

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
