"use client"

import { MotionContainer } from '@/components/motion-container'
import { MotionH1, MotionP } from '@/components/client-wrapper'

export default function TermsPage() {
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
            使用条款
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
          <h2 className="text-2xl font-semibold">服务说明</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>本系统提供以下服务：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>商品价格查询和管理</li>
              <li>数据分析和统计</li>
              <li>批量导入导出</li>
              <li>分类管理</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">用户责任</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>用户在使用本系统时应：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>遵守相关法律法规</li>
              <li>保护账户安全</li>
              <li>确保数据准确性</li>
              <li>不得滥用系统功能</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">知识产权</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>本系统的知识产权包括但不限于：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>系统源代码</li>
              <li>界面设计</li>
              <li>文档资料</li>
              <li>商标标识</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">免责声明</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>本系统不承担以下责任：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>用户数据的准确性</li>
              <li>因不可抗力导致的服务中断</li>
              <li>用户违规操作造成的损失</li>
              <li>第三方链接的内容</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">条款更新</h2>
          <p className="text-muted-foreground">
            我们保留随时更新这些条款的权利。重大变更时，我们会通过适当方式通知用户。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">联系方式</h2>
          <p className="text-muted-foreground">
            如有任何问题，请联系：
            <a href="mailto:2739218253@qq.com" className="text-primary hover:underline ml-1">
              2739218253@qq.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
} 