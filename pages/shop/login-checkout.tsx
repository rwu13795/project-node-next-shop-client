import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthForm from "../../components/forms/auth-form";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import { inputFieldsArray } from "../auth/sign-in";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

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
    <main>
      {currentUser.cart.length > 0 ? (
        <div>
          <h1>SIGN IN</h1>
          <div>
            RETURNING CUSTOMER
            <AuthForm
              inputType={inputTypes.signIn}
              inputFieldsArray={inputFieldsArray}
            />
          </div>
          <hr></hr>
          <div>
            GUEST CHECKOUT
            <Link href="/shop/checkout">
              <a>
                <button>CHECKOUT AS GUEST</button>
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <h2>There Is No Item In Your Shopping Cart.</h2>
      )}
    </main>
  );
};

export default LoginCheckoutPage;
