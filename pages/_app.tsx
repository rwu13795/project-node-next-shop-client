// import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
// import "bootstrap/dist/css/bootstrap.css";

import { stripePromise } from "../utils/helper-functions/load-stripe";
import Layout from "../components/layout/layout";
import store from "../utils/redux-store";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout {...pageProps}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Elements stripe={stripePromise}>
          <Component {...pageProps} />
        </Elements>
      </Layout>
    </Provider>
  );
}
