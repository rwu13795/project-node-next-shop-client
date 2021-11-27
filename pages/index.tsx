import type { NextPage } from "next";
import Head from "next/head";

import { useEffect } from "react";

import Swiper_homePage from "../components/image/home-page/swiper";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../utils/redux-store/layoutSlice";
import { setLoadingStatus } from "../utils/redux-store/userSlice";

const Home: NextPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageLoading(false));
    dispatch(setLoadingStatus("idle"));
  }, [dispatch]);

  return (
    <main style={{ height: "calc(100vh - 73px)" }}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Swiper_homePage />
    </main>
  );
};

export default Home;

export function getStaticProps() {
  // (2) //
  return { props: { page: "home" } };
}

// NOTE //
/*
  (1)
  set the specific height for the Swiper in the Home Page by deducting the height
  of the NavBar, then use height: 100% in all the children components (the Swiper)
  
  While using "%" to set height and width, all elements Node in the chain must
  have their styles set as "height: xx%; width: xx%"
  if one of the node misses this styles, all the children belong to this node
  won't get the height and width from the root node

  (2)
  when one of the page is loaded, the props returned from getServerSide/StaticProps
  of the current page will be automatically passed to the _app.js and merged to
  the "pageProps". So we can tell the "navigation" inside the "Layout" that
  which page we are currently in, then change the navigation bar accordingly

*/
