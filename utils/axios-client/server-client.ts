import axios from "axios";
import { GetServerSidePropsContext } from "next";

// all the NextJS pages that are server-side-rendered, must have a
// headers property in order to check for session, you must use this
// custom axios client to make request in all pages
const serverClient = (ctx: GetServerSidePropsContext) => {
  console.log("typeof window ", typeof window);
  if (typeof window === undefined) {
    console.log("in server in server in server");
    // in server
    return axios.create({
      // baseURL: "/",
      headers: ctx.req?.headers,
    });
  } else {
    console.log("in browser in browser in browser");
    // in browser
    return axios.create({
      // baseURL: "/",
      withCredentials: true,
    });
    // because when the page is loaded before, NextJS will use the cached code
    // in the browser. So, NextJS is making request in the browser environment,
    // we have to include "withCredentials: true" inside the axios to set the
    // headers for the request
  }
};

export default serverClient;

// NOTE !!!!!!
// Remember !! the "context" that is passed to this custom _app.js page, has the
// "ctx" nested inside. the "context.ctx" is what we need to find the headers

// the cookie/session that we get from the client sign-in request will be
// packed inside the "req.headers", and it is also passed inside the "context"
// we need to set the cookie in the header manually to let NextJS use the cookie for all the pages
