import { ThemeProvider } from "@mui/material/styles";
import React from "react";

import { theme } from "../../styles/mui-theme";
import MainNavigation from "./main-navigation";

interface Prop {
  children: React.ReactNode;
  page?: string;
}

export default function Layout(props: Prop): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <MainNavigation page={props.page} />
      <main>{props.children}</main>
    </ThemeProvider>
  );
}
