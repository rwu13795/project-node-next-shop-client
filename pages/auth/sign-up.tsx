import type { GetServerSidePropsContext, NextPage } from "next";

import serverClient from "../../util/axios-client/server-client";
import SignIn_SignUp from "../../components/authentication/sign-in-up";

const SignUpPage: NextPage = ({}) => {
  return <SignIn_SignUp is_signingIn={false} />;
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
