/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Allow production builds to succeed even if there are lint errors.
    ignoreDuringBuilds: false
  },
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Image optimization
  images: {
    domains: [
      'replicate.delivery',
      'replicate.com',
      'upload.wikimedia.org',
      'collectionapi.metmuseum.org',
      'www.artic.edu',
      'lh3.googleusercontent.com'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  }
};

module.exports = nextConfig;
