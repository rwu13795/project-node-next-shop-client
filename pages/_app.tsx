import Head from "next/head";
import { Provider } from "react-redux";
import React from "react";

import Layout from "../components/layout/layout";
import store from "../utils/redux-store";

// inject MUI styles to server-side
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

// NOTE //
/*
 bug on windows for next@11.1.1 and above using in typescript 

 the global CSS module cannot be imported inside this _app.tsx as the Next docs 
 suggests

 error - ./styles/globals.css
 Global CSS cannot be imported from files other than your Custom <App>. Due to the Global nature of stylesheets, and to avoid conflicts, Please move all first-party global CSS imports to pages/_app.js. Or convert the import to Component-Level CSS (CSS Modules).
 Read more: https://nextjs.org/docs/messages/css-global
 Location: pages\_app.js

 the bug only occurs on Windows for next@11.1.1 and above. If I downgrade to 11.1.0,
 it might work. 

 PS: I did not try the solution above since I used module.css in all the pages
     I should build my next app in WSL Ubuntu, and see if this solution works 
*/
