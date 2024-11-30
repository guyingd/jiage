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
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
} from 'chart.js'
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2'
import { ProductData } from '@/lib/products'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
)

interface AdvancedAnalyticsProps {
  data: ProductData
}

export function AdvancedAnalytics({ data }: AdvancedAnalyticsProps) {
  const stats = useMemo(() => {
    const categories = Object.entries(data)
      .filter(([key]) => key !== '// 配置说明')

    // 基础统计
    let totalProducts = 0
    let totalValue = 0
    let maxPrice = 0
    let minPrice = Infinity
    let priceSum = 0

    // 价格区间分布
    const priceRanges = {
      '0-50': 0,
      '51-100': 0,
      '101-200': 0,
      '201-500': 0,
      '501-1000': 0,
      '1000+': 0
    }

    // 月度趋势（模拟数据）
    const months = ['1月', '2月', '3月', '4月', '5月', '6月']
    const monthlyData = months.map(() => ({
      sales: Math.floor(Math.random() * 1000),
      revenue: Math.floor(Math.random() * 10000)
    }))

    categories.forEach(([_, items]) => {
      items.forEach((item: { price: number }) => {
        totalProducts++
        totalValue += item.price
        maxPrice = Math.max(maxPrice, item.price)
        minPrice = Math.min(minPrice, item.price)
        priceSum += item.price

        // 更新价格区间统计
        if (item.price <= 50) priceRanges['0-50']++
        else if (item.price <= 100) priceRanges['51-100']++
        else if (item.price <= 200) priceRanges['101-200']++
        else if (item.price <= 500) priceRanges['201-500']++
        else if (item.price <= 1000) priceRanges['501-1000']++
        else priceRanges['1000+']++
      })
    })

    const avgPrice = totalProducts > 0 ? priceSum / totalProducts : 0
    const priceStdDev = Math.sqrt(
      categories.reduce((sum, [_, items]) => 
        sum + items.reduce((s, item: { price: number }) => 
          s + Math.pow(item.price - avgPrice, 2), 0
        ), 0
      ) / totalProducts
    )

    return {
      categories: categories.map(([name, items]) => ({
        name,
        count: items.length,
        totalValue: items.reduce((sum, item: { price: number }) => sum + item.price, 0),
        avgPrice: items.reduce((sum, item: { price: number }) => sum + item.price, 0) / items.length
      })),
      priceRanges,
      monthlyData,
      totalProducts,
      totalValue,
      avgPrice,
      maxPrice,
      minPrice,
      priceStdDev
    }
  }, [data])

  return (
    <div className="space-y-8">
      {/* 关键指标 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '商品总数', value: stats.totalProducts },
          { label: '总价值', value: `¥${stats.totalValue.toLocaleString()}` },
          { label: '平均价格', value: `¥${Math.round(stats.avgPrice).toLocaleString()}` },
          { label: '价格标准差', value: `¥${Math.round(stats.priceStdDev).toLocaleString()}` }
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg p-6 border">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 图表网格 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 分类价值分布 */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">分类价值分布</h3>
          <div className="h-[300px]">
            <Bar
              data={{
                labels: stats.categories.map(c => c.name),
                datasets: [
                  {
                    label: '总价值',
                    data: stats.categories.map(c => c.totalValue),
                    backgroundColor: 'rgba(147, 51, 234, 0.5)',
                    borderColor: 'rgb(147, 51, 234)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* 价格区间分布 */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">价格区间分布</h3>
          <div className="h-[300px]">
            <Doughnut
              data={{
                labels: Object.keys(stats.priceRanges),
                datasets: [{
                  data: Object.values(stats.priceRanges),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                  ],
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* 月度趋势 */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">月度趋势</h3>
          <div className="h-[300px]">
            <Line
              data={{
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [
                  {
                    label: '销量',
                    data: stats.monthlyData.map(d => d.sales),
                    borderColor: 'rgb(147, 51, 234)',
                    backgroundColor: 'rgba(147, 51, 234, 0.5)',
                    yAxisID: 'y',
                  },
                  {
                    label: '收入',
                    data: stats.monthlyData.map(d => d.revenue),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    yAxisID: 'y1',
                  }
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                }
              }}
            />
          </div>
        </div>

        {/* 分类雷达图 */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">分类分析</h3>
          <div className="h-[300px]">
            <Radar
              data={{
                labels: stats.categories.map(c => c.name),
                datasets: [
                  {
                    label: '商品数量',
                    data: stats.categories.map(c => c.count),
                    backgroundColor: 'rgba(147, 51, 234, 0.2)',
                    borderColor: 'rgb(147, 51, 234)',
                    pointBackgroundColor: 'rgb(147, 51, 234)',
                  },
                  {
                    label: '平均价格',
                    data: stats.categories.map(c => c.avgPrice),
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgb(59, 130, 246)',
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                  }
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 