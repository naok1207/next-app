/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "imgix",
    path: "./public",
  },
};

module.exports = nextConfig;
