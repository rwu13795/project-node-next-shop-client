import { ThemeProvider } from "@mui/material/styles";
import React, { useCallback, useEffect, useState, CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";

import { theme } from "../../styles/mui-theme";
import styles from "./__layout.module.css";

import MainNavigation from "./navbar/navigation";
import { checkStock, getUserStatus } from "../../utils/redux-store/userSlice";
import Footer from "./footer";

import { Grid } from "@mui/material";
import { selectLockScrollBar } from "../../utils/redux-store/layoutSlice";
import { border } from "@mui/system";

interface Prop {
  children: React.ReactNode;
  page?: string;
  page_cat?: string;
  sub_cat?: string;
}

export default function Layout({
  children,
  page,
  page_cat,
  sub_cat,
}: Prop): JSX.Element {
  // since the Layout component will be rendered on every page,
  // the user auth will be checked no matter which page is loaded up first
  const dispatch = useDispatch();

  const lockScrollBar = useSelector(selectLockScrollBar);

  const [scrollBarStyle, setScrollBarStyle] = useState({});

  useEffect(() => {
    if (lockScrollBar) {
      setScrollBarStyle({ maxHeight: "100vh", overflow: "hidden" });
    } else {
      // to hidden the weird x-scroll bar in Home page which appears after unlocking
      // since all the pages' width is under 100vw, so setting the overflowX: "hidden"
      // won't break anything in all the children pages
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

    <main className={styles.root_page_layout} style={scrollBarStyle}>
      <ThemeProvider theme={theme}>
        <MainNavigation page={page} page_cat={page_cat} sub_cat={sub_cat} />

        <main className={styles.main_component}>
          <div className={styles.main_component_grid}>{children}</div>
        </main>

        {page !== "checkout" && <Footer />}
      </ThemeProvider>
    </main>
  );
}
