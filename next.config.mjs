/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    // Let browsers request remote images directly in dev; the server-side optimizer
    // otherwise turns intermittent TMDB connectivity into noisy request errors.
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      }
    ],
    minimumCacheTTL: 60,
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      { key: 'Origin-Agent-Cluster', value: '?1' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ];

    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-ancestors 'none'",
          "form-action 'self' https://*.clerk.accounts.dev https://*.clerk.com",
          "script-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://challenges.cloudflare.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://image.tmdb.org https://images.unsplash.com https://images.clerk.dev https://img.clerk.com https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev",
          "connect-src 'self' https://api.themoviedb.org https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://clerk-telemetry.com https://*.clerk-telemetry.com https://challenges.cloudflare.com wss://*.clerk.accounts.dev wss://*.clerk.com wss://*.clerk.dev",
          "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://challenges.cloudflare.com",
          "worker-src 'self' blob:",
          'upgrade-insecure-requests',
        ].join('; '),
      });
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000',
      });
    }

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
