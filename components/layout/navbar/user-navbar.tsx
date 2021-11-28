import {
  Fragment,
  useEffect,
  useRef,
  useState,
  CSSProperties,
  memo,
} from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

import { Divider, Grid, TextField, Box, Tooltip } from "@mui/material";

import UserIcon from "../navbar-items/user-icon";
import CartIcon from "../navbar-items/cart-icon";
import SearchIcon from "../navbar-items/search-icon";
import MenuList from "../navbar-items/menu-list";
import MenuIcon from "../navbar-items/menu-icon";

interface Props {
  page?: string;
  page_cat?: string;
}

function UserNavbar({ page, page_cat }: Props): JSX.Element {
  const [showMenu_nav, setShowMenu_nav] = useState<boolean>(false);
  const [currentCat, setCurrentCat] = useState<string>("");
  const [showCart, setShowCart] = useState<boolean>(false);

  const isSmall = useMediaQuery({ query: "(max-width: 765px)" });

  const onLeaveMenuGrid = () => {
    setShowMenu_nav(false);
    // the currentCat is maintained in the parent, so that the border-bottom
    // is set individually according to the currentCat
    setCurrentCat("");
  };

  const openCartDropDown = () => {
    setShowCart(true);
  };

  const closeCartDropDown = () => {
    setShowCart(false);
  };

  return (
    <Fragment>
      {/* * * * * * * left navbar * * * * * * */}
      <Grid
        item
        container
        md={6}
        sm={false}
        xs={false}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        wrap="nowrap"
        sx={{ pr: 2, pt: 2, pb: 2, display: { xs: "none", md: "flex" } }}
        onMouseLeave={onLeaveMenuGrid}
      >
        <MenuList
          setShowMenu_nav={setShowMenu_nav}
          showMenu_nav={showMenu_nav}
          setCurrentCat={setCurrentCat}
          currentCat={currentCat}
          page_cat={page_cat}
        />
      </Grid>

      {/* * * * * * * right navbar * * * * * * */}
      {isSmall ? (
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
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <Grid item>
            <MenuIcon />
          </Grid>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item sx={{ pl: "1vw" }}>
            <UserIcon page={page} closeCartDropDown={closeCartDropDown} />
          </Grid>
          <Grid item sx={{ pl: "1vw", mr: "1rem" }}>
            <CartIcon
              showCart={showCart}
              openCartDropDown={openCartDropDown}
              closeCartDropDown={closeCartDropDown}
            />
          </Grid>
        </Grid>
      ) : (
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
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item sx={{ ml: "2vw" }}>
            <UserIcon page={page} closeCartDropDown={closeCartDropDown} />
          </Grid>
          <Grid item sx={{ ml: "2vw", mr: "1rem" }}>
            <CartIcon
              showCart={showCart}
              openCartDropDown={openCartDropDown}
              closeCartDropDown={closeCartDropDown}
            />
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
}

export default memo(
  dynamic(() => Promise.resolve(UserNavbar), {
    ssr: false,
  })
);
