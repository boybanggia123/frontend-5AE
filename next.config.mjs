/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    
    config.resolve.alias = {
      ...config.resolve.alias,
      'lodash-es': 'lodash',
    };
    return config;
  },
};

export default nextConfig;
