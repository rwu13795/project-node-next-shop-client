import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { theme } from "../../styles/mui-theme";
import MainNavigation from "./main-navigation";
import { getAuthStatus } from "../../utils/redux-store/userSlice";

interface Prop {
  children: React.ReactNode;
  page?: string;
}

export default function Layout(props: Prop): JSX.Element {
  // since the Layout component will be rendered on every page,
  // I will chekc the user auth here on the first load up
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("getting user auth in Layout");
    dispatch(getAuthStatus());
  }, [dispatch]);

  // NOTE //
  // MUI theme only works on MUI component which is inside a normal React component
  // it does not work on Next pages. In order to make the MUI theme works for the MUI
  // conponent, every MUI component must be wrapped inside a Recat component,
  // then put this React component inside the Next Page
  return (
    // the <ThemeProvider> here will provide theme for all MUI components inside
    // all the pages
    <ThemeProvider theme={theme}>
      <MainNavigation page={props.page} />
      <main>{props.children}</main>
    </ThemeProvider>
  );
}
