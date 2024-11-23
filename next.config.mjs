/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.storage.tonilab.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.tonilab.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
