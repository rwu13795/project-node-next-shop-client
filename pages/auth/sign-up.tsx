import type { GetServerSidePropsContext, NextPage } from "next";

import serverClient from "../../util/axios-client/server-client";

import AuthForm from "../../components/authentication/auth-form";
import { inputTypes } from "../../util/enums/input-types";
import { inputNames } from "../../util/enums/input-names";

const inputFieldsArray = [
  inputNames.email,
  inputNames.password,
  inputNames.confirm_password,
  inputNames.first_name,
  inputNames.last_name,
];

const SignUpPage: NextPage = ({}) => {
  return (
    <AuthForm inputType={inputTypes.signUp} inputFields={inputFieldsArray} />
  );
};

export default SignUpPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  // if the user loads this sign-in page directly using the url
  // I should check the user-auth before rendering the page
  const { data } = await client.get(
    "http://localhost:5000/api/auth/auth-status"
  );

  console.log(data);

  if (data.isLoggedIn) {
    // redirect the user to the main page without rendering the sign-up page
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
