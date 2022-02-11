/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdn.node-next-shop-rw.store",
      "localhost",
      "node-next-shop-server.herokuapp.com",
      "project-node-react-chat.s3.us-east-2.amazonaws.com",
      "testing-images-on-s3.s3.us-east-2.amazonaws.com",
    ],
  },
};
