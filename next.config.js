/** @type {import('next').NextConfig} */
const nextConfig = {
  // 默认配置用于 Vercel
  images: {
    domains: ['your-domain.com'],
  }
}

// 只在构建桌面应用时启用导出
if (process.env.ELECTRON_BUILD) {
  nextConfig.output = 'export'
  nextConfig.images = {
    unoptimized: true
  }
}

module.exports = nextConfig 