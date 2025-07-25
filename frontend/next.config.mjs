/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
      {
        protocol: "https",
        hostname: "blogs-backend-bootcamp-tests.onrender.com",
      },
      {
        protocol: "https",
        hostname: "hhspvoopjjmiuahjaueh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
