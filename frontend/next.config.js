/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api', // Use relative path for mock API
  },
  
  // Image optimization
  images: {
    domains: ['fgbcjlklkochkjpwaupr.supabase.co'],
  },
  
  // Output configuration for Netlify
  output: 'standalone',
  
  // Redirect API calls to mock service
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/mock/:path*',
      },
    ]
  }
}

module.exports = nextConfig