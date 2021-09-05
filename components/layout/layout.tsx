import { Fragment } from "react";
import React from "react";

import MainNavigation from "./main-navigation";

interface Prop {
  children: React.ReactNode;
}

export default function Layout({ children }: Prop): JSX.Element {
  return (
    <Fragment>
      <MainNavigation />
      <main>{children}</main>
    </Fragment>
  );
}
