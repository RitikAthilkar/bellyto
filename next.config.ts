import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    logging: {
    fetches: {
      fullUrl: true
    }
  },
  
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        // port: '',
        // pathname: '/account123/**',
        // search: '',
      },
      {
      protocol: "https",
      hostname: "res.cloudinary.com",
    },
      {
      protocol: "https",
      hostname: "cdn-icons-png.flaticon.com",
    },
    ],
  },
};

export default nextConfig;
