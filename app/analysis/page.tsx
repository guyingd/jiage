"use client"

import { useState } from 'react'
import { AdvancedAnalytics } from '@/components/advanced-analytics'
import { ExportButton } from '@/components/export-button'
import productsData from '@/public/data/products.json'
import { type ProductData } from '@/lib/types'

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">数据分析</h1>
        <ExportButton data={productsData as ProductData} filename="analysis-data.json" />
      </div>

      <AdvancedAnalytics data={productsData as ProductData} />
    </div>
  )
} 