import axios from "axios";

// all the NextJS pages that are server-side-rendered, must have a
// headers property in order to check for session, you must use this
// custom axios client to make request in all pages
const browserClient = () => {
  return axios.create({
    baseURL: "/",
    withCredentials: true,
  });
};

export default browserClient;
