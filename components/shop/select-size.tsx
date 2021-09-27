import React, { useState } from "react";
import ToggleButton, { ToggleButtonProps } from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { styled } from "@mui/material/styles";

interface Props {
  selectedSize: string | null | undefined;
  sizeHandler: (event: React.MouseEvent<HTMLElement>, size: string) => void;
}

// MUI 5.0 new method "styled" to customize the MUI component
// DO not use the "makeStyles" method, warning will keep popping up while using this
// method in NextJS page
const StyledToggleButton = styled(ToggleButton)<ToggleButtonProps>(
  ({ theme }) => ({
    "&.Mui-selected": {
      backgroundColor: "black",
      color: "#ffffff",
      "&:hover": { backgroundColor: "black" },
      "&:active": { backgroundColor: "grey" },
    },
    // "&:hover": {
    //   backgroundColor: "grey",
    //   color: "white",
    // },
    "&:active": {
      backgroundColor: "grey",
    },
  })
);

export default function SelectSize({
  selectedSize,
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
        <StyledToggleButton value="small" aria-label="small">
          small
        </StyledToggleButton>
        <StyledToggleButton value="medium" aria-label="medium">
          Medium
        </StyledToggleButton>
        <StyledToggleButton value="large" aria-label="large">
          Large
        </StyledToggleButton>
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
