import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import Head from "next/head";

import serverClient from "../../../utils/axios-client/server-client";
import ForgotPasswordReset from "../../../components/forms/forgot-pw-reset";

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
    return (
      <main style={{ marginTop: "50px" }}>
        <h1 style={{ textAlign: "center" }}>
          The link for resetting your password has expired, please make a{" "}
          <Link href={"/auth/forgot-password"}>NEW REQUEST</Link> again.
        </h1>
      </main>
    );
  }

  return (
    <main style={{ marginTop: "50px" }}>
      <Head>
        <title>Reset Passwords</title>
      </Head>

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
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/token-check`,
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
