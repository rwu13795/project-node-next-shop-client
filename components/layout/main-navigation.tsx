import Link from "next/link";
import Head from "next/head";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./main-navigation.module.css";
import {
  getAuthStatus,
  selectCurrentUser,
  selectIsLoggedIn,
  signOut,
} from "../../utils/redux-store/userSlice";
import SignInModal from "../auth/sign-in-modal";
import CartIcon from "../shop/cart";

interface Props {
  page?: string;
}

export default function MainNavigation({ page }: Props) {
  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  const signOutHandler = async () => {
    dispatch(signOut());
    // re-acquire a "guest" session after signing out
    // have to wait a few seconds for the mongoDB destoying the old session
    setTimeout(() => {
      dispatch(getAuthStatus());
    }, 2000);
  };

  return (
    <Fragment>
      <main className={styles.main}>
        <section>
          <div>
            <Link href="/">
              <a>logo</a>
            </Link>
          </div>
          {page !== "a" && (
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
            </Fragment>
          )}

          <div style={{ textAlign: "right" }}>
            {isLoggedIn ? (
              <Fragment>
                <div>Welcome back {currentUser.username}</div>
                <button onClick={signOutHandler}>Sign Out</button>
              </Fragment>
            ) : (
              <SignInModal />
            )}
            <CartIcon />
          </div>
        </section>
      </main>
    </Fragment>
  );
}
