import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Divider, Grid, TextField, Box } from "@mui/material";

import g_styles from "../../styles/globals.module.css";
import styles from "./navigation.module.css";
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

interface Props {
  page?: string;
}

export default function MainNavigation({ page }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);

  const [classname, setClassname] = useState(styles.main_1);

  console.log("class-1", styles.main_1);
  console.log("class-2", styles.main_2);

  const adminSignOutHandler = () => {
    dispatch(adminSignOut());
    setTimeout(() => {
      dispatch(getUserStatus());
    }, 2000);
    router.push("/admin");
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
        console.log(window.pageYOffset);
        if (window.pageYOffset < 200) {
          setClassname(styles.main_2);
        } else {
          setClassname(styles.main_1);
        }
        console.log("onscrollstop");
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
        {/* left navbar */}
        <Grid
          item
          container
          md={6}
          direction="row"
          justifyContent="flex-start"
          alignItems="baseline"
          sx={{ pr: 2 }}
        >
          <MenuList />
        </Grid>

        {/* right navbar */}
        <Grid
          item
          container
          md={6}
          sm={12}
          xs={12}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid
            item
            sx={{
              paddingRight: 2,
              display: { xs: "block", md: "none", textAlign: "right" },
            }}
          >
            menu
          </Grid>

          <Grid item>
            <SearchIcon />
          </Grid>

          <Grid item sx={{ ml: "1vw" }}>
            <UserIcon page={page} />
          </Grid>

          <Grid item sx={{ ml: "1vw", mr: "0.5rem" }}>
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
        <Grid item md={2} sm={2} xs={4}>
          <Link href="/">
            <a>
              <div style={{ paddingLeft: "1.5vw" }}>
                <Image
                  src="/Nextjs-logo-1.svg"
                  alt="NextJS Logo"
                  width={165}
                  height={75}
                />
              </div>
            </a>
          </Link>
        </Grid>
        <Grid
          item
          md={10}
          sm={10}
          xs={8}
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
