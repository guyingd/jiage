import productsData from '@/public/data/products.json'

export function generateStaticParams() {
  return Object.keys(productsData)
    .filter(key => key !== '// 配置说明')
    .map(category => ({
      category: category
    }))
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 