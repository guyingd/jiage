"use client"

import { MotionContainer } from '@/components/motion-container'
import { MotionH1, MotionP } from '@/components/client-wrapper'

export default function PrivacyPage() {
  return (
    <div className="space-y-12">
      <MotionContainer>
        <div className="text-center space-y-4">
          <MotionH1 
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            隐私政策
          </MotionH1>
          <MotionP 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            最后更新：2024-11-30
          </MotionP>
        </div>
      </MotionContainer>

      <div className="max-w-3xl mx-auto space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">信息收集</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>我们收集的信息包括：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>账户信息（用户名、邮箱等）</li>
              <li>商品数据（名称、价格等）</li>
              <li>使用数据（访问日志、操作记录等）</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">信息使用</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>我们使用收集的信息：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>提供和改进服务</li>
              <li>个性化用户体验</li>
              <li>发送系统通知</li>
              <li>分析使用情况</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">信息安全</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>我们采取以下措施保护您的信息：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>使用加密技术保护数据传输</li>
              <li>定期备份数据</li>
              <li>限制访问权限</li>
              <li>监控系统安全</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cookie 使用</h2>
          <p className="text-muted-foreground">
            我们使用 Cookie 来改善用户体验，包括：记住登录状态、保存用户偏好设置等。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">联系我们</h2>
          <p className="text-muted-foreground">
            如果您对我们的隐私政策有任何疑问，请联系：
            <a href="mailto:2739218253@qq.com" className="text-primary hover:underline ml-1">
              2739218253@qq.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
} 