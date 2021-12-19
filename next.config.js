/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.imgur.com",
      "localhost",
      "testing-images-on-s3.s3.us-east-2.amazonaws.com",
    ],
  },
};
