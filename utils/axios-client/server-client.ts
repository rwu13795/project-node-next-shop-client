import axios, { AxiosRequestConfig } from "axios";
import { GetServerSidePropsContext } from "next";

// for pages that need to fetch data from a route which requires session
// (such "auth" routes), a cookie must be packed inside the request.
// since all the pages are server-side rendered, I cannot use {credential: true}
// inside the Axios as I did in the client site. The cookie must be directly set
// inside the Axios request's headers in order to let the express-session get the
// session properly.

// Also, the request headers containing the cookie is in the the "context",
// which is automatically passed inside the "getServerSideProps"

const serverClient = (context: GetServerSidePropsContext) => {
  let config: AxiosRequestConfig = {};
  if (!context.req.headers.cookie) {
    config = { withCredentials: true };
  } else {
    config = {
      headers: { cookie: context.req.headers.cookie },
    };
  }

  return axios.create(config);
};

export default serverClient;

// the cookie/session that we get from the client sign-in request will be
// packed inside the "req.headers", and it is also passed inside the "context"
// we need to set the cookie in the header manually to let NextJS use the cookie for all the pages
