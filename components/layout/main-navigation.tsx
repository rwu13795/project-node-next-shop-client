import Link from "next/link";
import Head from "next/head";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./main-navigation.module.css";
import {
  getUserStatus,
  selectCurrentUser,
  selectIsLoggedIn,
  signOut,
} from "../../utils/redux-store/userSlice";
import SignInModal from "../auth/sign-in-modal";
import CartIcon from "../shop/cart/cart-icon";
import { useRouter } from "next/dist/client/router";
import {
  adminSignOut,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";

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
        <div>
          <Link href="/shop/women">
            <a>WOMEN</a>
          </Link>
        </div>
        <div>
          <Link href="/shop/men">
            <a>MEN</a>
          </Link>
        </div>
        <div>
          <Link href="/shop/kids">
            <a>KIDS</a>
          </Link>
        </div>
        <div style={{ textAlign: "right" }}>
          {isLoggedIn ? (
            <Fragment>
              <div>Welcome back {currentUser.username}</div>
              <button onClick={signOutHandler}>Sign Out</button>
            </Fragment>
          ) : (
            <SignInModal page={page} />
          )}
          <CartIcon />
        </div>
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
    <Fragment>
      <main className={styles.main}>
        <section>
          <div>
            <Link href="/">
              <a>logo</a>
            </Link>
          </div>
          {content}
        </section>
      </main>
    </Fragment>
  );
}
