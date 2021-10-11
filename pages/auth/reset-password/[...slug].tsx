import { GetServerSidePropsContext, NextPage } from "next";
import AuthForm from "../../../components/auth/auth-form";

import serverClient from "../../../utils/axios-client/server-client";
import ForgotPasswordReset from "../../../components/auth/forgot-pw-reset";

interface PageProps {
  userId: string;
  token: string;
  timeOut?: boolean;
}

const ForgotPasswordResetPage: NextPage<PageProps> = ({
  userId,
  token,
  timeOut,
}) => {
  if (timeOut) {
    return <h1>Link expired</h1>;
  }

  // if (resetSuccess) {
  //   return <RedirectToLogin resetSuccess={resetSuccess} />;
  // }

  return (
    <main>
      <ForgotPasswordReset token={token} userId={userId} />
    </main>
  );
};

export default ForgotPasswordResetPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  // console.log(context.params.slug[0]);
  // the token sent from the server is attached to url as /reset-pw/randomtoken
  // we need to use the context.params.slug to get that "randomtoken"
  let token: string | undefined;
  if (context && context.params && context.params.slug) {
    token = context.params.slug[0];
  }

  if (token === undefined) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }

  try {
    // send request to the server to check the reset-token before rendering the page
    const { data } = await client.post(
      "http://localhost:5000/api/auth/token-check",
      {
        token,
      }
    );

    return {
      props: { userId: data.userId, token },
    };
  } catch (err: any) {
    const data = err.response.data;
    console.log("in catch error", data);

    return {
      props: { timeOut: true },
    };
  }
}
