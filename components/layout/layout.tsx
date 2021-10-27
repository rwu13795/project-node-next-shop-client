import { ThemeProvider } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { theme } from "../../styles/mui-theme";
import classes from "./_layout.module.css";

import MainNavigation from "./navbar/navigation";
import { checkStock, getUserStatus } from "../../utils/redux-store/userSlice";
import Footer from "./footer";
// import { getAdminStatus } from "../../utils/redux-store/adminSlice";

interface Prop {
  children: React.ReactNode;
  page?: string;
}

export default function Layout(props: Prop): JSX.Element {
  // since the Layout component will be rendered on every page,
  // the user auth will be checked no matter which page is loaded up first
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserStatus());
    // delay the checkstock for 2 seconds, so that the session can be created
    // and checkStock won't trigger a duplicated session in the shop route
    const timerId = setTimeout(() => {
      dispatch(checkStock());
      // dispatch(getAdminStatus());
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

    // Don't fucking know why the props in the "style" do not work when they are
    // put inside the module.css. Maybe the MUI in the children component has
    // classes with higher priority? I have to use the "style" directly in order to
    // make these props work
    <main
      className={classes.page_layout}
      // style={{ position: "relative", minHeight: "100vh" }}
    >
      <ThemeProvider theme={theme}>
        <MainNavigation page={props.page} />
        <div className={classes.page_body}>
          <main>{props.children}</main>
        </div>
        <Footer />
      </ThemeProvider>
    </main>
  );
}
