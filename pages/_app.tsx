import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";

import Layout from "../components/layout/layout";
import store from "../utils/redux-store";

//////////////////
import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";

import { theme } from "../styles/mui-theme";
import createEmotionCache from "../utils/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Layout {...pageProps}>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head>
            <CssBaseline />
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  );
}

// MUI integration with NextJS
// https://github.com/mui-org/material-ui/tree/master/examples/nextjs
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
