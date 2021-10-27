import { Fragment, useEffect, useRef, useState, CSSProperties } from "react";

import { Divider, Grid, TextField, Box, Tooltip } from "@mui/material";

import UserIcon from "./../navbar-items/user-icon";
import CartIcon from "./../navbar-items/cart-icon";
import SearchIcon from "./../navbar-items/search-icon";
import MenuList from "./../navbar-items/menu-list";
import MenuIcon from "./../navbar-items/menu-icon";

export default function UserNavbar({ page }: { page?: string }): JSX.Element {
  const [showMenu_nav, setShowMenu_nav] = useState<boolean>(false);

  const onLeaveMenuGrid = () => {
    setShowMenu_nav(false);
  };

  return (
    <Fragment>
      {/* * * * * * * left navbar * * * * * * */}
      <Grid
        item
        container
        md={6}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        wrap="nowrap"
        sx={{ pr: 2, pb: 3, pt: 3, display: { xs: "none", md: "flex" } }}
        onMouseLeave={onLeaveMenuGrid}
      >
        <MenuList
          setShowMenu_nav={setShowMenu_nav}
          // setBorder={setBorder}
          // border={border}
          showMenu_nav={showMenu_nav}
        />
      </Grid>

      {/* * * * * * right navbar - MEDIUM * * * * * * */}
      <Grid
        item
        container
        md={6}
        sm={false}
        xs={false}
        direction="row"
        wrap="nowrap"
        justifyContent="flex-end"
        alignItems="center"
        sx={{
          display: { xs: "none", md: "flex" },
        }}
      >
        <Grid item>
          <SearchIcon />
        </Grid>

        <Grid item sx={{ ml: "2vw" }}>
          <UserIcon page={page} />
        </Grid>

        <Grid item sx={{ ml: "2vw", mr: "1rem" }}>
          <CartIcon />
        </Grid>
      </Grid>

      {/* * * * * * right navbar - SMALL * * * * * * */}
      <Grid
        item
        container
        md={false}
        sm={12}
        xs={12}
        direction="row"
        wrap="nowrap"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          display: { xs: "flex", md: "none" },
        }}
      >
        <Grid item>
          <MenuIcon />
        </Grid>

        <Grid item>
          <SearchIcon />
        </Grid>

        <Grid item sx={{ pl: "1vw" }}>
          <UserIcon page={page} />
        </Grid>

        <Grid item sx={{ pl: "1vw", mr: "1rem" }}>
          <CartIcon />
        </Grid>
      </Grid>
    </Fragment>
  );
}
