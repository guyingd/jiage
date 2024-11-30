export interface Product {
  name: string
  price: number
  previousPrice?: number
}

export interface ConfigInfo {
  version: string
  lastUpdate: string
  categories: string
  order: string
}

export interface ProductData {
  [category: string]: Product[] | ConfigInfo
  "// 配置说明": ConfigInfo
} 