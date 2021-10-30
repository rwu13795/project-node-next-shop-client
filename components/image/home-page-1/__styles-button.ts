import { SxProps, Theme } from "@mui/system";
import { CSSProperties } from "react";

///////////
// React //
///////////
export const prev_botton = {
  position: {
    position: "absolute",
    top: "39%",
    left: "0vh",
    zIndex: 9,
    cursor: "pointer",
  } as CSSProperties,
  text: {
    fontSize: "1.1rem",
    position: "relative",
    left: "-20%",
  } as CSSProperties,
};

export const next_botton = {
  position: {
    position: "absolute",
    top: "39%",
    right: "0vh",
    zIndex: 9,
    cursor: "pointer",
  } as CSSProperties,
  text: {
    fontSize: "1.1rem",
    position: "relative",
    right: "-20%",
  } as CSSProperties,
};

export const prev_botton_small = {
  position: {
    position: "absolute",
    bottom: "40vh",
    zIndex: 9,
    cursor: "pointer",
    textAlign: "center",
  } as CSSProperties,
  text: {
    fontSize: "1.1rem",
    position: "relative",
    left: "-15%",
  } as CSSProperties,
};

export const next_botton_small = {
  position: {
    position: "absolute",
    top: "30vh",
    right: "1vh",
    zIndex: 9,
    cursor: "pointer",
  } as CSSProperties,
  text: {
    fontSize: "1.1rem",
    position: "relative",
    right: "-15%",
  } as CSSProperties,
};

/////////
// MUI //
/////////
export const sx_botton = {
  large: { display: { xs: "none", md: "block" } } as SxProps<Theme>,
  small: { display: { xs: "block", md: "none" } } as SxProps<Theme>,
};
