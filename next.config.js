/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.imgur.com",
      "localhost",
      "node-next-shop-server.herokuapp.com",
      "testing-images-on-s3.s3.us-east-2.amazonaws.com",
    ],
  },
};
