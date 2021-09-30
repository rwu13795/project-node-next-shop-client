// import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";

// import "bootstrap/dist/css/bootstrap.css";

import Layout from "../components/layout/layout";
import store from "../utils/redux-store";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout {...pageProps}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
