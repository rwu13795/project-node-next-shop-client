import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import AuthForm from "../../components/auth/auth-form";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import { inputFieldsArray } from "../auth/sign-in";

const LoginCheckoutPage: NextPage = ({}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && currentUser.userId) {
      router.push(`/shop/checkout?userId=${currentUser.userId}`);
    }
  }, [isLoggedIn, router, currentUser.userId]);

  return (
    <main>
      <h1>SIGN IN</h1>
      <div>
        RETURNING CUSTOMER
        <AuthForm
          inputType={inputTypes.signIn}
          inputFields={inputFieldsArray}
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
    </main>
  );
};

export default LoginCheckoutPage;
