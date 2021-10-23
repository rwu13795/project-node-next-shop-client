import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import { Fragment, useEffect, useRef, useState, CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Divider, Grid, TextField, Box } from "@mui/material";

import g_styles from "../../styles/globals.module.css";
import styles from "./_navigation.module.css";
import {
  getUserStatus,
  selectCurrentUser,
  selectIsLoggedIn,
  signOut,
} from "../../utils/redux-store/userSlice";
import {
  adminSignOut,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";

import UserIcon from "./navbar-items/user-icon";
import CartIcon from "./navbar-items/cart-icon";
import SearchIcon from "./navbar-items/search-icon";
import MenuList from "./navbar-items/menu-list";
import MenuDrawer from "./navbar-items/menu-drawer";
import MenuIcon from "./navbar-items/menu-icon";

interface Props {
  page?: string;
}

export default function MainNavigation({ page }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);

  const [classname, setClassname] = useState(styles.main_1);
  const [showMenu_nav, setShowMenu_nav] = useState<boolean>(false);
  const [border, setBorder] = useState<CSSProperties>({});

  const adminSignOutHandler = () => {
    dispatch(adminSignOut());
    setTimeout(() => {
      dispatch(getUserStatus());
    }, 2000);
    router.push("/admin");
  };

  const onLeaveMenuGrid = () => {
    setBorder({});
    setShowMenu_nav(false);
  };

  // when user is scrolling, turn the Navbar to transparent
  let handle: any = null;
  function createScrollStopListener(
    element: Window,
    callback: Function,
    timeout: number
  ) {
    let onScroll = function () {
      if (handle) {
        clearTimeout(handle);
        if (classname !== styles.main_2) {
          setClassname(styles.main_2);
        }
      }
      handle = setTimeout(callback, timeout || 200); // default 200 ms
    };
    element.addEventListener("scroll", onScroll);
    return function () {
      element.removeEventListener("scroll", onScroll);
    };
  }

  useEffect(() => {
    createScrollStopListener(
      window,
      function () {
        if (window.pageYOffset < 200) {
          setClassname(styles.main_2);
        } else {
          setClassname(styles.main_1);
        }
      },
      1500
    );
    return () => {
      clearTimeout(handle);
    };
  }, []);

  let content;
  if (page !== "admin") {
    content = (
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
            setBorder={setBorder}
            border={border}
            showMenu_nav={showMenu_nav}
          />
        </Grid>

        {/* * * * * * right navbar * * * * * * */}
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
          <Grid
            item
            sx={{
              display: { xs: "block", md: "none", textAlign: "right" },
            }}
          >
            <MenuIcon />
          </Grid>

          <Grid item>
            <SearchIcon />
          </Grid>

          <Grid item sx={{ ml: "1vw" }}>
            <UserIcon page={page} />
          </Grid>

          <Grid item sx={{ ml: "1vw", mr: "1rem" }}>
            <CartIcon />
          </Grid>
        </Grid>
        {/* * * * * * right navbar * * * * * * */}
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
          <Grid
            item
            sx={{
              display: { xs: "block", md: "none", textAlign: "right" },
            }}
          >
            <MenuIcon />
          </Grid>

          <Grid item>
            <SearchIcon />
          </Grid>

          <Grid item sx={{ ml: "1vw" }}>
            <UserIcon page={page} />
          </Grid>

          <Grid item sx={{ ml: "1vw", mr: "1rem" }}>
            <CartIcon />
          </Grid>
        </Grid>
      </Fragment>
    );
  } else {
    content = (
      <div style={{ textAlign: "right" }}>
        {loggedInAsAdmin && (
          <button onClick={adminSignOutHandler}>Sign Out</button>
        )}
      </div>
    );
  }

  return (
    <main className={classname}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item md={2} sm={5} xs={5}>
          <div style={{ paddingLeft: "1.5vw" }}>
            <Link href="/">
              <a>
                <Image
                  src="/Nextjs-logo-1.svg"
                  alt="NextJS Logo"
                  width={165}
                  height={70}
                />
              </a>
            </Link>
          </div>
        </Grid>
        <Grid
          item
          md={10}
          sm={7}
          xs={7}
          container
          justifyContent="space-between"
          alignItems="center"
        >
          {content}
        </Grid>
      </Grid>
      {/* <Divider /> */}
    </main>
  );
}
