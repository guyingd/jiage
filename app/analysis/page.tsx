"use client"

import { useState } from 'react'
import { AdvancedAnalytics } from '@/components/advanced-analytics'
import { ExportButton } from '@/components/export-button'
import productsData from '@/products.json'

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">数据分析</h1>
        <ExportButton data={productsData} filename="analysis-data.json" />
      </div>

      <AdvancedAnalytics data={productsData} />
    </div>
  )
} 