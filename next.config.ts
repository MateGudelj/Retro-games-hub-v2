import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
      //contentful
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
       //Google
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
       
      {
        protocol: 'https',
        hostname: 'developers.elementor.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
