import { z } from 'zod'

// 基础类型
export interface Product {
  name: string
  price: number
  previousPrice?: number
}

// 登录验证
export const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(6, '密码至少6位')
})

// 分类验证
export const categorySchema = z.object({
  name: z.string()
    .min(1, '分类名称不能为空')
    .max(50, '分类名称不能超过50个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9\s-]+$/, '分类名称只能包含中文、英文、数字、空格和连字符')
})

// 商品验证
export const productSchema = z.object({
  name: z.string()
    .min(1, '商品名称不能为空')
    .max(100, '商品名称不能超过100个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9\s-+]+$/, '商品名称只能包含中文、英文、数字、空格、加号和连字符'),
  price: z.coerce.number()
    .min(0, '价格不能小于0')
    .max(1000000, '价格不能超过1,000,000')
})

// 类型导出
export type LoginInput = z.infer<typeof loginSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type ProductFormData = z.infer<typeof productSchema> 