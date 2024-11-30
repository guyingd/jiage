import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // 验证数据格式
    if (typeof data !== 'object') {
      return new NextResponse('数据格式无效', { status: 400 })
    }

    // 保存配置信息
    if (!data['// 配置说明']) {
      return new NextResponse('缺少配置信息', { status: 400 })
    }

    // 保存到文件
    const filePath = join(process.cwd(), 'public/data/products.json')
    await writeFile(filePath, JSON.stringify(data, null, 2))

    return new NextResponse('保存成功', { status: 200 })
  } catch (error) {
    console.error('保存错误:', error)
    return new NextResponse('内部错误', { status: 500 })
  }
} 