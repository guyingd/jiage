/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  distDir: 'dist/app',
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer'
    }
    return config
  }
}

module.exports = nextConfig 