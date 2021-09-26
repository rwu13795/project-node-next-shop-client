import React, { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { makeStyles } from "@mui/styles";

import styles from "./select-size.module.css";
import { theme } from "../../styles/mui-theme";

interface Props {
  selectedSize: string | null | undefined;
  sizeHandler: (event: React.MouseEvent<HTMLElement>, size: string) => void;
}

const useStyles = makeStyles({
  buttonColor: {
    "&.Mui-selected": {
      backgroundColor: "black",
      color: "#ffffff",
      "&:hover": { backgroundColor: "grey" },
      "&:active": { backgroundColor: "silver" },
    },
    "&:hover": {
      backgroundColor: "grey",
      color: "white",
    },
    "&:active": {
      backgroundColor: "brown",
    },
  },
});

export default function SelectSize({
  selectedSize,
  sizeHandler,
}: Props): JSX.Element {
  const [style, setStyle] = useState<Object>({});

  const classes = useStyles();

  return (
    <div>
      <ToggleButtonGroup
        value={selectedSize}
        exclusive
        onChange={sizeHandler}
        aria-label="text alignment"
        color="primary"
      >
        <ToggleButton
          value="small"
          aria-label="small"
          className={classes.buttonColor}
        >
          small
        </ToggleButton>
        <ToggleButton value="medium" aria-label="medium">
          Medium
        </ToggleButton>
        <ToggleButton value="large" aria-label="large">
          Large
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
