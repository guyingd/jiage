/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  // 排除 API 路由
  excludePages: ['/api/**/*']
}

module.exports = nextConfig 