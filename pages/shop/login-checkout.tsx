import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";

import AuthForm from "../../components/forms/auth-form";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import { inputFieldsArray } from "../auth/sign-in";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

// UI //
import styles from "./__checkout.module.css";

const LoginCheckoutPage: NextPage = ({}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);
  const router = useRouter();
  const dispatch = useDispatch();

  // if guest user signed in, push user to the checkout page
  useEffect(() => {
    if (isLoggedIn && currentUser.userId) {
      router.push("/shop/checkout");
    }
  }, [isLoggedIn, router, currentUser.userId]);

  useEffect(() => {
    dispatch(setPageLoading(false));
  });

  useEffect(() => {
    return instantlyToTop;
  }, []);

  return (
    <main className={styles.main_container_login_checkout}>
      <Head>
        <title>Checkout</title>
      </Head>

      <div className={styles.main_grid_login_checkout}>
        {currentUser.cart.length > 0 ? (
          <div>
            <AuthForm
              inputType={inputTypes.signIn}
              inputFieldsArray={inputFieldsArray}
              page="checkout-sign-in"
            />
          </div>
        ) : (
          <div className={styles.main_container_no_item}>
            <div className={styles.main_title}>CHECKOUT</div>
            <div className={styles.no_item_text}>
              You don&apos;t have any item in the cart
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default LoginCheckoutPage;
