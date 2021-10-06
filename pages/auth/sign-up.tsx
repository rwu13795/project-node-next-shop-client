import type { GetServerSidePropsContext, NextPage } from "next";

import serverClient from "../../utils/axios-client/server-client";

import AuthForm from "../../components/auth/auth-form";
import { inputTypes } from "../../utils/enums-types/input-types";
import { inputNames } from "../../utils/enums-types/input-names";

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
  return (
    <AuthForm
      inputType={inputTypes.signUp}
      inputFieldsArray={inputFieldsArray}
    />
  );
};

export default SignUpPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  // if the user loads this sign-in page directly using the url
  // I should check the user-auth before rendering the page
  const { data } = await client.get(
    "http://localhost:5000/api/auth/user-status"
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

  return { props: { page: "sign-up" } };
}
