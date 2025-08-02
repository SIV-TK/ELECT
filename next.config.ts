import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Render.com specific configuration
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Allow public access
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  // Ensure environment variables are available
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyCx-ga-Ywvj8tk3BgleNd3qib5lLO8Bxss',
  },
  // Configure webpack for Leaflet
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'leaflet': require.resolve('leaflet'),
    };
    return config;
  },
};

export default nextConfig;
