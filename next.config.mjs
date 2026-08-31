/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produces a self-contained `.next/standalone` server bundle, which is
  // the recommended output for deploying to a Node.js host such as
  // Hostinger's Node.js App feature or a Hostinger VPS (see
  // HOSTINGER_DEPLOYMENT.md).
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'localhost:3001',
        'oky-opex.vercel.app',
        'oky-opex-8hzvs7t08-oky6.vercel.app',
        // Add your Hostinger domain(s) here, e.g. 'yourdomain.com'
      ],
    },
  },
};

export default nextConfig;
