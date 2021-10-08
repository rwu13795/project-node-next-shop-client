import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { theme } from "../../styles/mui-theme";
import styles from "./layout.module.css";

import MainNavigation from "./main-navigation";
import {
  checkStock,
  getUserStatus,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import Footer from "./footer";
import { getAdminStatus } from "../../utils/redux-store/adminSlice";

interface Prop {
  children: React.ReactNode;
  page?: string;
}

export default function Layout(props: Prop): JSX.Element {
  // since the Layout component will be rendered on every page,
  // I will chekc the user auth here on the first load up
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.page !== "admin") console.log("getting user auth in Layout");
    dispatch(getUserStatus());

    // delay the checkstock for 2 seconds, so that the session can be created
    // and checkStock won't trigger a duplicated session in the shop route
    const timerId = setTimeout(() => {
      dispatch(checkStock());
      dispatch(getAdminStatus());
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [dispatch, props.page]);

  console.log("in layout -- current page:", props.page);

  // NOTE //
  // MUI theme only works on MUI component which is inside a normal React component
  // it does not work on Next pages. In order to make the MUI theme works for the MUI
  // conponent, every MUI component must be wrapped inside a Recat component,
  // then put this React component inside the Next Page
  return (
    // the <ThemeProvider> here will provide theme for all MUI components inside
    // all the pages
    <main style={{ position: "relative", minHeight: "100vh" }}>
      <ThemeProvider theme={theme}>
        <MainNavigation page={props.page} />
        <div className={styles.body}>
          <main>{props.children}</main>
        </div>
        <Footer />
      </ThemeProvider>
    </main>
  );
}
