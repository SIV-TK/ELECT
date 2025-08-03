/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: [
      '@genkit-ai/core',
      '@genkit-ai/firebase', 
      'genkit',
      'genkitx-deepseek',
      'puppeteer',
      'playwright',
      'sharp',
      '@opentelemetry/instrumentation',
      'require-in-the-middle'
    ],
  },
  
  // Webpack configuration to handle problematic modules
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ignore problematic modules that cause warnings
    config.ignoreWarnings = [
      /require\.extensions is not supported by webpack/,
      /Critical dependency: require function is used in a way/,
      /Module not found: Can't resolve '@genkit-ai\/firebase'/,
      /Critical dependency: the request of a dependency is an expression/,
      /Can't resolve 'handlebars'/,
    ];

    // Handle fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      path: false,
      os: false,
      stream: false,
      util: false,
    };

    // Exclude problematic modules from client-side bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'handlebars': false,
        '@genkit-ai/firebase': false,
        '@opentelemetry/instrumentation': false,
        'require-in-the-middle': false,
      };
    }

    // Add externals for server-side AI modules
    if (isServer) {
      config.externals = [
        ...config.externals,
        '@genkit-ai/core',
        '@genkit-ai/firebase',
        'genkit', 
        'genkitx-deepseek',
        '@opentelemetry/instrumentation'
      ];
    }

    // Add rules for handling various file types
    config.module.rules.push(
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      }
    );

    return config;
  },

  // Images configuration for better performance
  images: {
    domains: ['localhost', 'vercel.app', 'firebaseapp.com'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Disable specific pages by redirecting to dashboard
      {
        source: '/ai-features-demo',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/interactive-visualizations',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/demo-voting',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/corruption-risk',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/crowd-sourced-intel',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },

  // Enable compression
  compress: true,

  // Remove X-Powered-By header
  poweredByHeader: false,

  // No trailing slash
  trailingSlash: false,

  // Enable static optimization
  swcMinify: true,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;