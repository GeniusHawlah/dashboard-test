import type { NextConfig } from "next";
// import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    five_minutes: {
      stale: 300,
      revalidate: 300, // revalidates every five minutes
      expire: 604800, //a week
    },

    ten_minutes: {
      stale: 600,
      revalidate: 600, // revalidates every five minutes
      expire: 604800, //a week
    },

    five_seconds: {
      stale: 5,
      revalidate: 5,
      expire: 6,
    },

    thirty_seconds: {
      stale: 30,
      revalidate: 30,
      expire: 31,
    },

    one_day: {
      stale: 1440, // a day
      revalidate: 1440,
      expire: 604800,
    },
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true, //log full URL of fetch requests that hit the server
    },
  },

  experimental: {
    serverComponentsHmrCache: true,
    // optimizePackageImports: [
    //   // "flowbite-react",
    //   "react-icons",
    //   "@iconify-icon/react",
    //   "iconify-icon",
    //   "radix-ui",
    //   "@radix-ui/themes",
    //   "@radix-ui/react-slot",
    //   "radix-ui",
    // ],

    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },
};

export default nextConfig;
