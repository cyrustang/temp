/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true,
    },
  }
  
  module.exports = nextConfig