/** @type {import('next').NextConfig} */
const nextConfig = {
  // 默认配置用于 Vercel
  images: {
    domains: ['your-domain.com'],
  }
}

// 如果是桌面应用构建，使用不同的配置
if (process.env.NEXT_CONFIG_FILE === 'next.config.electron.js') {
  nextConfig.output = 'export'
  nextConfig.images = {
    unoptimized: true
  }
  // 排除 API 路由
  nextConfig.excludePages = ['/api/**/*']
}

module.exports = nextConfig 