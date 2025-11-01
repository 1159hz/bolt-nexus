/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
  
  // Image optimization
  images: {
    domains: ['fgbcjlklkochkjpwaupr.supabase.co'],
  },
  
  // Output configuration for Netlify
  output: 'standalone',
}

module.exports = nextConfig
