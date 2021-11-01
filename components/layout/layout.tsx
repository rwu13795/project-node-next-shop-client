import { ThemeProvider } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { theme } from "../../styles/mui-theme";
import classes from "./__layout.module.css";

import MainNavigation from "./navbar/navigation";
import { checkStock, getUserStatus } from "../../utils/redux-store/userSlice";
import Footer from "./footer";

import { Grid } from "@mui/material";
import { selectLockScrollBar } from "../../utils/redux-store/layoutSlice";

interface Prop {
  children: React.ReactNode;
  page?: string;
}

export default function Layout(props: Prop): JSX.Element {
  // since the Layout component will be rendered on every page,
  // the user auth will be checked no matter which page is loaded up first
  const dispatch = useDispatch();

  const lockScrollBar = useSelector(selectLockScrollBar);

  const [scrollBarStyle, setScrollBarStyle] = useState({});

  console.log("lockScrollBar", lockScrollBar);

  useEffect(() => {
    if (lockScrollBar) {
      setScrollBarStyle({ maxHeight: "100vh", overflow: "hidden" });
    } else {
      setScrollBarStyle({});
    }
  }, [lockScrollBar]);

  useEffect(() => {
    dispatch(getUserStatus());
    // delay the checkstock for 2 seconds, so that the session can be created
    // and checkStock won't trigger a duplicated session in the shop route
    const timerId = setTimeout(() => {
      dispatch(checkStock());
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [dispatch]);

  // NOTE //
  // MUI theme only works on MUI component which is inside a normal React component
  // it does not work on Next pages. In order to make the MUI theme works for the MUI
  // conponent, every MUI component must be wrapped inside a Recat component,
  // then put this React component inside the Next Page
  return (
    // the <ThemeProvider> here will provide theme for all MUI components inside
    // all the pages

    <main className={classes.root_page_layout} style={scrollBarStyle}>
      <ThemeProvider theme={theme}>
        <MainNavigation page={props.page} />
        <Grid container className={classes.root_page_grid}>
          <Grid item className={classes.root_page_body}>
            <main>{props.children}</main>
          </Grid>
        </Grid>
        <Footer />
      </ThemeProvider>
    </main>
  );
}
