import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CurrentUser,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import {
  selectPageLoading,
  setPageLoading,
} from "../../utils/redux-store/layoutSlice";
import serverClient from "../../utils/axios-client/server-client";
import AuthForm from "../../components/forms/auth-form";
import { inputTypes } from "../../utils/enums-types/input-types";
import { inputNames } from "../../utils/enums-types/input-names";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";

export const inputFieldsArray = [inputNames.email, inputNames.password];

const SignInPage: NextPage = ({}) => {
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  // redirect the user to home page after resetting the password
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    dispatch(setPageLoading(false));
    return instantlyToTop();
  });

  return (
    <AuthForm
      inputType={inputTypes.signIn}
      inputFieldsArray={inputFieldsArray}
      page="user-sign-in"
    />
  );
};

export default SignInPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  // if the user loads this sign-in page directly using the url
  // I should check the user-auth before rendering the page
  const { data } = await client.get(
    "http://localhost:5000/api/auth/user-status"
  );

  if (data.currentUser.isLoggedIn) {
    // redirect the user to the main page without rendering the signin page
    // if user has a signed-in session
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { page: "auth" } };
}
