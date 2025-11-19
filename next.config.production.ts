import type { NextConfig } from "next";

// Get API URL from environment variable
const API_HOST = process.env.NEXT_PUBLIC_API_HOST || (() => {
  const host = process.env.NEXT_PUBLIC_API_HOSTNAME || 'localhost';
  const port = process.env.NEXT_PUBLIC_API_PORT || '3002';
  return `${host}:${port}`;
})();
const API_PROTOCOL = process.env.NEXT_PUBLIC_API_PROTOCOL || 'http';
const PRODUCTION_DOMAIN = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 'yourdomain.com';

const nextConfig: NextConfig = {
  /* config options here */
  
  // Standalone output for cPanel deployment
  output: 'standalone',
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      ...(process.env.NODE_ENV === 'development' ? [{
        protocol: (process.env.NEXT_PUBLIC_API_PROTOCOL || 'http') as const,
        hostname: process.env.NEXT_PUBLIC_API_HOSTNAME || 'localhost',
        port: process.env.NEXT_PUBLIC_API_PORT || '3002',
        pathname: '/uploads/**',
      }] : []),
      ...(PRODUCTION_DOMAIN ? [{
        protocol: 'https' as const,
        hostname: PRODUCTION_DOMAIN,
        pathname: '/uploads/**',
      }] : []),
    ],
  },

  // Compression
  compress: true,

  // Disable ESLint during build for production deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: ${process.env.NODE_ENV === 'development' ? `${API_PROTOCOL}://${API_HOST}` : ''} ${PRODUCTION_DOMAIN ? `https://${PRODUCTION_DOMAIN}` : ''}; connect-src 'self' ${process.env.NODE_ENV === 'development' ? `${API_PROTOCOL}://${API_HOST}` : ''} ${PRODUCTION_DOMAIN ? `https://${PRODUCTION_DOMAIN}` : ''}; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      },
      // Cache static assets
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Cache images
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Cache fonts
      {
        source: '/Font/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
