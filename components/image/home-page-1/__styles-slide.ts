import { SxProps, Theme } from "@mui/system";
import { CSSProperties } from "react";

///////////
// React //
///////////
export const slide_large = {
  title: {
    position: "absolute",
    top: "20%",
    right: "50%",
    color: "white",
    fontSize: "4.5vw",
    margin: "1vh",
    zIndex: 9,
  } as CSSProperties,
  slide: {
    margin: "0 7.5vh 0 7.5vh",
    backgroundColor: "black",
  } as CSSProperties,
};

export const slide_small = {
  title: {
    position: "absolute",
    top: "13%",
    left: "60vw",
    fontSize: "3.5vw",
  } as CSSProperties,
  slide: {
    paddingTop: "0rem",
    margin: "-2 5vh 10vw 5vh",
    height: "100%",
    minHeight: "100vh",
  } as CSSProperties,
};

/////////
// MUI //
/////////
export const sx_slide_large = {
  title: { display: { xs: "none", md: "block" } } as SxProps<Theme>,
  slide: {
    boxShadow: 20,
    display: { xs: "none", md: "block" },
  } as SxProps<Theme>,
};

export const sx_slide_small = {
  title: { display: { xs: "block", md: "none" } } as SxProps<Theme>,
  slide: { display: { xs: "block", md: "none" } } as SxProps<Theme>,
};
