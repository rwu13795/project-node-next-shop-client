import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { theme } from "../../styles/mui-theme";
import MainNavigation from "./main-navigation";
import { getAuthStatus } from "../../store/authSlice";

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

  return (
    <ThemeProvider theme={theme}>
      <MainNavigation page={props.page} />
      <main>{props.children}</main>
    </ThemeProvider>
  );
}
