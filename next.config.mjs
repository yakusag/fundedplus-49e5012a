/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: [
    "*.replit.dev",
    "*.replit.app",
    "*.worf.replit.dev",
    "*.kirk.replit.dev",
  ],
};

export default nextConfig;
