"use client"

import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { type Product } from '@/lib/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ProductData {
  [key: string]: Product[] | {
    version: string
    lastUpdate: string
    categories: string
    order: string
  }
}

interface StatisticsSectionProps {
  data: ProductData
}

export function StatisticsSection({ data }: StatisticsSectionProps) {
  const statistics = useMemo(() => {
    const stats = Object.entries(data)
      .filter(([key]) => key !== '// 配置说明')
      .map(([category, items]) => {
        if (!Array.isArray(items)) return null
        return {
          category,
          count: items.length,
          totalValue: items.reduce((sum, item) => sum + item.price, 0),
          averagePrice: items.reduce((sum, item) => sum + item.price, 0) / items.length
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)

    return {
      totalProducts: stats.reduce((sum, item) => sum + item.count, 0),
      totalValue: stats.reduce((sum, item) => sum + item.totalValue, 0),
      averagePrice: stats.reduce((sum, item) => sum + item.totalValue, 0) / 
                   stats.reduce((sum, item) => sum + item.count, 0),
      categoryStats: stats
    }
  }, [data])

  const chartData: ChartData<'bar'> = {
    labels: statistics.categoryStats.map(item => item.category),
    datasets: [
      {
        label: '商品数量',
        data: statistics.categoryStats.map(item => item.count),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: '平均价格',
        data: statistics.categoryStats.map(item => item.averagePrice),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '分类统计'
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* 总体统计 */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">总商品数</h3>
          <p className="text-2xl">{statistics.totalProducts}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">总价值</h3>
          <p className="text-2xl">¥{statistics.totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">平均价格</h3>
          <p className="text-2xl">¥{statistics.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* 图表 */}
      <div className="bg-card p-4 rounded-lg border">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  )
} 