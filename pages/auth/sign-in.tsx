import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { selectIsLoggedIn } from "../../utils/redux-store/userSlice";
import serverClient from "../../utils/axios-client/server-client";
import AuthForm from "../../components/auth/sign-in-up-form";
import { inputTypes } from "../../utils/enums-types/input-types";
import { inputNames } from "../../utils/enums-types/input-names";

export const inputFieldsArray = [inputNames.email, inputNames.password];

const SignInPage: NextPage = ({}) => {
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // redirect the user to home page after resetting the password
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  });

  return (
    <AuthForm
      inputType={inputTypes.signIn}
      inputFieldsArray={inputFieldsArray}
    />
  );
};

export default SignInPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  // if the user loads this sign-in page directly using the url
  // I should check the user-auth before rendering the page
  const { data } = await client.get(
    "http://localhost:5000/api/auth/auth-status"
  );

  console.log(data);

  if (data.isLoggedIn) {
    // redirect the user to the main page without rendering the signin page
    // if user has a signed-in session
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
