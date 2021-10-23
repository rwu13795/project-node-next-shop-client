import { Fragment } from "react";

import { Drawer } from "@mui/material";

export default function MenuDrawer(): JSX.Element {
  return (
    <Fragment>
      <Drawer open={true}>menu drawer </Drawer>
    </Fragment>
  );
}
