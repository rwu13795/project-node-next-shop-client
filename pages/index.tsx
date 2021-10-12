import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import g_styles from "../styles/globals.module.css";
import { Grid } from "@mui/material";

const Home: NextPage = () => {
  return (
    <main className={g_styles.main}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <h1>
          <Box>Home Page</Box>
        </h1>
        <Grid container justifyContent="center">
          <Grid item>
            <Image src="/jojo.jpg" alt="home-1" width={900} height={700} />
          </Grid>
        </Grid>
      </Box>
      <Button variant="outlined" color="secondary">
        Primary
      </Button>
    </main>
  );
};

export default Home;

export function getStaticProps() {
  // when one of the page is loaded, the props returned from getServerSide/StaticProps
  // of the current page will be automatically passed to the _app.js and merged to
  // the "pageProps". So we can tell the "navigation" inside the "Layout" that
  // which page we are currently in, then change the navigation bar accordingly

  return { props: { page: "home" } };
}
