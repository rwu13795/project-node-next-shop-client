import { GetServerSidePropsContext, NextPage } from "next";

import serverClient from "../../../utils/axios-client/server-client";
import ForgotPasswordReset from "../../../components/auth/forms/forgot-pw-reset";

interface PageProps {
  userId: string;
  token: string;
  expiration: number;
  timeOut?: boolean;
}

const ForgotPasswordResetPage: NextPage<PageProps> = ({
  userId,
  token,
  expiration,
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
      <ForgotPasswordReset
        token={token}
        userId={userId}
        expiration={expiration}
      />
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

    console.log(data.expiration);

    return {
      props: {
        userId: data.userId,
        token,
        expiration: data.expiration,
        page: "auth",
      },
    };
  } catch (err: any) {
    const data = err.response.data;
    console.log("in catch error", data);

    return {
      props: { timeOut: true, page: "auth" },
    };
  }
}
