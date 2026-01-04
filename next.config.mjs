/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimize performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable React optimizations
  experimental: {
    optimizeCss: true,
  },
  
  // Image optimization
  images: {
    domains: ['www.artic.edu', 'collectionapi.metmuseum.org', 'www.rijksmuseum.nl', 'upload.wikimedia.org'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers for better performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
