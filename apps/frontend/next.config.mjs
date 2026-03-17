/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 's3.yourdomain.com'], // Add your S3 CDN domain here
  },
};

export default nextConfig;
