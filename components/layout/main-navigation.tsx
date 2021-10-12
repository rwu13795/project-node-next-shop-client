import Link from "next/link";
import Head from "next/head";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import g_styles from "../../styles/globals.module.css";
import {
  getUserStatus,
  selectCurrentUser,
  selectIsLoggedIn,
  signOut,
} from "../../utils/redux-store/userSlice";
import SignInModal from "../auth/forms/sign-in-modal";
import CartIcon from "../shop/cart/cart-icon";
import { useRouter } from "next/dist/client/router";
import {
  adminSignOut,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";
import { Grid } from "@mui/material";

interface Props {
  page?: string;
}

export default function MainNavigation({ page }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);

  const signOutHandler = async () => {
    dispatch(signOut());
    // re-acquire a "guest" session after signing out
    // have to wait a few seconds for the mongoDB destoying the old session
    console.log("signing out");
    setTimeout(() => {
      dispatch(getUserStatus());
    }, 2000);
    router.push("/");
  };

  const adminSignOutHandler = () => {
    dispatch(adminSignOut());
    setTimeout(() => {
      dispatch(getUserStatus());
    }, 2000);
    router.push("/admin");
  };

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
          sx={{ borderColor: "red", border: 2 }}
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
          sx={{ borderColor: "black", border: 2 }}
        >
          <Grid
            sx={{
              paddingRight: 2,
              display: { xs: "block", sm: "none", textAlign: "right" },
            }}
          >
            menu
          </Grid>
          <Grid sx={{ borderColor: "black", border: 3 }}>
            {isLoggedIn ? (
              <Fragment>
                <div onClick={() => router.push("/auth/profile")}>
                  Welcome back {currentUser.username}
                </div>
                <button onClick={signOutHandler}>Sign Out</button>
              </Fragment>
            ) : (
              <SignInModal page={page} />
            )}
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
    <main className={g_styles.main}>
      <Grid
        container
        sx={{ borderColor: "red", border: 2 }}
        justifyContent="space-between"
        alignItems="center"
      >
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
