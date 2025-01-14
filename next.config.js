/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! UYARI !!
    // Tip hatalarını görmezden gelir
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'i.ytimg.com'],
  },
}

module.exports = nextConfig 