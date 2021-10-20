import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import g_styles from "../../styles/globals.module.css";
import styles from "./navigation.module.css";
import {
  getUserStatus,
  selectCurrentUser,
  selectIsLoggedIn,
  signOut,
} from "../../utils/redux-store/userSlice";
import SignInModal from "./navbar-items/sign-in-modal";
import CartIcon from "./navbar-items/cart-icon";
import { useRouter } from "next/dist/client/router";
import {
  adminSignOut,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";
import { Divider, Grid, TextField, Box } from "@mui/material";
import UserIcon from "./navbar-items/user-icon";

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
        <Grid
          item
          container
          md={6}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid
            item
            sx={{ paddingRight: 2, display: { xs: "none", md: "block" } }}
          >
            <Link href="/shop/women">
              <a style={{ color: "inherit", textDecoration: "inherit" }}>
                WOMEN
              </a>
            </Link>
          </Grid>
          <Grid
            item
            sx={{ paddingRight: 2, display: { xs: "none", md: "block" } }}
          >
            <Link href="/shop/men">
              <a style={{ color: "inherit", textDecoration: "inherit" }}>MEN</a>
            </Link>
          </Grid>
          <Grid
            item
            sx={{ paddingRight: 2, display: { xs: "none", md: "block" } }}
          >
            <Link href="/shop/kids">
              <a style={{ color: "inherit", textDecoration: "inherit" }}>
                KIDS
              </a>
            </Link>
          </Grid>
        </Grid>
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
            <TextField
              id="standard-basic"
              label="SEARCH"
              variant="standard"
              sx={{
                width: "12vw",
              }}
              inputProps={{ style: { fontSize: "1.4vw" } }}
              InputLabelProps={{ style: { fontSize: "1.2vw" } }}
            />
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
        <Grid item md={3} sm={3} xs={3}>
          <Link href="/">
            <a>
              <div style={{ paddingLeft: "1.5vw" }}>
                <Image
                  src="/Nextjs-logo-1.svg"
                  alt="NextJS Logo"
                  width={160}
                  height={70}
                />
              </div>
            </a>
          </Link>
        </Grid>
        <Grid
          item
          md={9}
          sm={9}
          xs={9}
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
