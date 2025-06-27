import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "13.59.197.112",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript:{
    ignoreBuildErrors: true,
  },
  api: {
    bodyParser: false, 
  },
};

export default withNextIntl(nextConfig);
