import Link from "next/link";
import Head from "next/head";
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
import SignInModal from "../auth/forms/sign-in-modal";
import CartIcon from "./navbar-items/cart-icon";
import { useRouter } from "next/dist/client/router";
import {
  adminSignOut,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";
import { Grid } from "@mui/material";
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
          md={8}
          sm={8}
          xs={1}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid
            item
            sx={{ paddingRight: 2, display: { xs: "none", sm: "block" } }}
          >
            <Link href="/shop/women">
              <a>WOMEN </a>
            </Link>
          </Grid>
          <Grid
            item
            sx={{ paddingRight: 2, display: { xs: "none", sm: "block" } }}
          >
            <Link href="/shop/men">
              <a>MEN</a>
            </Link>
          </Grid>
          <Grid
            item
            sx={{ paddingRight: 2, display: { xs: "none", sm: "block" } }}
          >
            <Link href="/shop/kids">
              <a>KIDS</a>
            </Link>
          </Grid>
        </Grid>
        <Grid
          item
          container
          md={4}
          sm={4}
          xs={11}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid
            item
            sx={{
              paddingRight: 2,
              display: { xs: "block", sm: "none", textAlign: "right" },
            }}
          >
            menu
          </Grid>
          <Grid item>
            {/* {isLoggedIn ? (
              <Fragment>
                <div onClick={() => router.push("/auth/profile")}>
                  Welcome back {currentUser.username}
                </div>
                <button onClick={signOutHandler}>Sign Out</button>
              </Fragment>
            ) : (
              <Fragment> */}
            <UserIcon page={page} />
            {/* <SignInModal page={page} /> */}
            {/* </Fragment>
            )} */}
          </Grid>
          <Grid item>
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
        <Grid item md={2} sm={2} xs={2}>
          <Link href="/">
            <a>logo</a>
          </Link>
        </Grid>
        <Grid
          item
          md={10}
          sm={10}
          xs={10}
          container
          justifyContent="space-between"
        >
          {content}
        </Grid>
      </Grid>
    </main>
  );
}
