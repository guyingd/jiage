import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string()
    .min(1, '分类名称不能为空')
    .max(50, '分类名称不能超过50个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9\s-]+$/, '分类名称只能包含中文、英文、数字、空格和连字符')
})

export const productSchema = z.object({
  name: z.string()
    .min(1, '商品名称不能为空')
    .max(100, '商品名称不能超过100个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9\s-+]+$/, '商品名称只能包含中文、英文、数字、空格、加号和连字符'),
  price: z.number()
    .min(0, '价格不能小于0')
    .max(1000000, '价格不能超过1,000,000')
})

export type CategoryFormData = z.infer<typeof categorySchema>
export type ProductFormData = z.infer<typeof productSchema> 