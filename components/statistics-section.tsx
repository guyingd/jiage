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
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { TrendingUp, Package, ShoppingBag } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface StatisticsSectionProps {
  data: {
    [key: string]: Array<{ name: string; price: number }>
  }
}

export function StatisticsSection({ data }: StatisticsSectionProps) {
  const stats = useMemo(() => {
    const categories = Object.keys(data).filter(key => key !== '// 配置说明')
    const totalProducts = categories.reduce((sum, cat) => sum + data[cat].length, 0)
    const totalValue = categories.reduce((sum, cat) => 
      sum + data[cat].reduce((catSum, item) => catSum + item.price, 0), 0
    )
    const avgPrice = totalValue / totalProducts

    return {
      totalProducts,
      totalValue,
      avgPrice,
      categoriesCount: categories.length
    }
  }, [data])

  const chartData = useMemo(() => {
    const categories = Object.keys(data).filter(key => key !== '// 配置说明')
    const categoryValues = categories.map(cat => 
      data[cat].reduce((sum, item) => sum + item.price, 0)
    )
    const categoryProducts = categories.map(cat => data[cat].length)

    return {
      categories,
      categoryValues,
      categoryProducts
    }
  }, [data])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">总商品数</p>
              <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">总价值</p>
              <h3 className="text-2xl font-bold">¥{stats.totalValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">平均价格</p>
              <h3 className="text-2xl font-bold">¥{Math.round(stats.avgPrice).toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">分类价值分布</h3>
          <div className="h-[300px]">
            <Bar
              data={{
                labels: chartData.categories,
                datasets: [
                  {
                    label: '总价值',
                    data: chartData.categoryValues,
                    backgroundColor: 'rgba(147, 51, 234, 0.5)',
                    borderColor: 'rgb(147, 51, 234)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">商品数量分布</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={{
                labels: chartData.categories,
                datasets: [
                  {
                    data: chartData.categoryProducts,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.5)',
                      'rgba(255, 206, 86, 0.5)',
                      'rgba(75, 192, 192, 0.5)',
                      'rgba(153, 102, 255, 0.5)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 