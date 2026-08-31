/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'localhost:3001',
        'oky-opex.vercel.app',
        'oky-opex-8hzvs7t08-oky6.vercel.app',
        'oky-opex.onrender.com',
        '*.onrender.com',
      ],
    },
  },
};

export default nextConfig;
