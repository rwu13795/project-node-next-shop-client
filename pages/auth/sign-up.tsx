import type { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Head from "next/head";

import serverClient from "../../utils/axios-client/server-client";

import AuthForm from "../../components/forms/auth-form";
import { inputTypes } from "../../utils/enums-types/input-types";
import { inputNames } from "../../utils/enums-types/input-names";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

const inputFieldsArray = [
  inputNames.email,
  inputNames.password,
  inputNames.confirm_password,
  inputNames.first_name,
  inputNames.last_name,
  inputNames.address_1,
  inputNames.address_2,
  inputNames.city,
  inputNames.state,
  inputNames.zip_code,
  inputNames.phone,
];

const SignUpPage: NextPage = ({}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  return (
    <main>
      <Head>
        <title>Sign Up</title>
      </Head>

      <AuthForm
        inputType={inputTypes.signUp}
        inputFieldsArray={inputFieldsArray}
        page="user-sign-up"
      />
    </main>
  );
};

export default SignUpPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  // if the user loads this sign-in page directly using the url
  // I should check the user-auth before rendering the page
  const { data } = await client.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/user-status`
  );

  if (data.currentUser.isLoggedIn) {
    // redirect the user to the main page without rendering the sign-up page
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
