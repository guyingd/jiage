"use client"

import { useState } from 'react'
import { DownloadIcon, XIcon } from '@/components/icons'
import { utils, write } from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { LoadingSpinner } from '@/components/loading-spinner'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface ExportButtonProps {
  data: any
  filename?: string
  batchSize?: number
  onBatchProgress?: (progress: number) => void
}

type ExportFormat = 'json' | 'csv' | 'excel' | 'pdf'

interface ExportOptions {
  columns: {
    key: string
    label: string
    selected: boolean
  }[]
  format: {
    price: {
      addSymbol: boolean  // 是否添加货币符号
      decimals: number    // 小数位数
    }
  }
}

// 添加 jspdf-autotable 的类型声明
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export function ExportButton({ 
  data, 
  filename = 'data',
  batchSize: initialBatchSize = 1000,
  onBatchProgress 
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showFormats, setShowFormats] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeFormat, setActiveFormat] = useState<ExportFormat | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [options, setOptions] = useState<ExportOptions>({
    columns: [
      { key: 'category', label: '分类', selected: true },
      { key: 'name', label: '商品名称', selected: true },
      { key: 'price', label: '价格', selected: true }
    ],
    format: {
      price: {
        addSymbol: true,
        decimals: 2
      }
    }
  })
  const [batchProcessing, setBatchProcessing] = useState(false)
  const [currentBatch, setCurrentBatch] = useState(0)
  const [totalBatches, setTotalBatches] = useState(0)
  const [batchSize, setBatchSize] = useState(initialBatchSize)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingFormat, setPendingFormat] = useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)
    setProgress(0)
    setActiveFormat(format)
    try {
      let blob: Blob
      let extension: string

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      switch (format) {
        case 'json':
          blob = new Blob([JSON.stringify(formatData(data), null, 2)], { type: 'application/json' })
          extension = 'json'
          break

        case 'csv':
          const csvContent = convertToCSV(data)
          blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
          extension = 'csv'
          break

        case 'excel':
          const excelContent = await convertToExcel(data)
          blob = new Blob([excelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          extension = 'xlsx'
          break

        case 'pdf':
          const pdfContent = await convertToPDF(data)
          blob = new Blob([pdfContent], { type: 'application/pdf' })
          extension = 'pdf'
          break

        default:
          throw new Error('不支持的导出格式')
      }

      clearInterval(progressInterval)
      setProgress(100)

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setTimeout(() => {
        setShowFormats(false)
        setShowOptions(false)
        setProgress(0)
      }, 1000)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setActiveFormat(null)
    }
  }

  const handlePreview = () => {
    const formattedData = formatData(data)
    setPreviewData(formattedData.slice(0, 5)) // 只预览前5条数据
    setShowPreview(true)
  }

  const formatData = (data: any) => {
    const selectedColumns = options.columns.filter(col => col.selected).map(col => col.key)
    
    // 确保数据是正确的格式
    const validData = Object.entries(data).reduce((acc, [category, items]) => {
      // 跳过配置说明和无效数据
      if (category === '// 配置说明' || !Array.isArray(items)) {
        return acc
      }
      acc[category] = items
      return acc
    }, {} as Record<string, any[]>)
    
    return Object.entries(validData).flatMap(([category, items]) =>
      items.map(item => {
        const formattedItem: any = {}
        if (selectedColumns.includes('category')) {
          formattedItem.分类 = category
        }
        if (selectedColumns.includes('name')) {
          formattedItem.商品名称 = item.name
        }
        if (selectedColumns.includes('price')) {
          let price = Number(item.price).toFixed(options.format.price.decimals)
          if (options.format.price.addSymbol) {
            price = `¥${price}`
          }
          formattedItem.价格 = price
        }
        return formattedItem
      })
    )
  }

  const convertToCSV = (data: any): string => {
    // 将数据扁平化为数组
    const validData = Object.entries(data).reduce((acc, [category, items]) => {
      if (category === '// 配置说明' || !Array.isArray(items)) {
        return acc
      }
      acc[category] = items
      return acc
    }, {} as Record<string, any[]>)

    const flatData = Object.entries(validData).flatMap(([category, items]) =>
      items.map(item => ({
        category,
        ...item
      }))
    )

    // 获取所有列
    const columns = ['category', 'name', 'price']
    const headers = ['分类', '商品名称', '价格']

    // 生成 CSV 内容
    const csvRows = [
      headers.join(','),
      ...flatData.map(row =>
        columns.map(col => {
          const value = row[col as keyof typeof row]
          return typeof value === 'string' ? `"${value}"` : value
        }).join(',')
      )
    ]

    return '\uFEFF' + csvRows.join('\n') // 添加 BOM 以支持中文
  }

  const convertToExcel = async (data: any): Promise<ArrayBuffer> => {
    // 将数据扁平化为数组
    const validData = Object.entries(data).reduce((acc, [category, items]) => {
      if (category === '// 配置说明' || !Array.isArray(items)) {
        return acc
      }
      acc[category] = items
      return acc
    }, {} as Record<string, any[]>)

    const flatData = Object.entries(validData).flatMap(([category, items]) =>
      items.map(item => ({
        分类: category,
        商品名称: item.name,
        价格: item.price
      }))
    )

    // 创建工作簿
    const wb = utils.book_new()
    
    // 创建工作表
    const ws = utils.json_to_sheet(flatData, {
      header: ['分类', '商品名称', '价格'],
    })

    // 设置列宽
    ws['!cols'] = [
      { wch: 15 }, // 分类列宽
      { wch: 20 }, // 商品名称列宽
      { wch: 10 }, // 价格列宽
    ]

    // 添加工作表到工作簿
    utils.book_append_sheet(wb, ws, '商品数据')

    // 生成 Excel 文件
    const excelBuffer = write(wb, { 
      bookType: 'xlsx', 
      type: 'array',
      Props: {
        Title: "商品价格数据",
        Subject: "商品价格查询系统导出数据",
        Author: "商品价格查询系统",
        CreatedDate: new Date()
      }
    })

    return excelBuffer
  }

  const convertToPDF = async (data: any): Promise<ArrayBuffer> => {
    const doc = new jsPDF()
    
    // 设置中文字体
    doc.addFont('https://cdn.jsdelivr.net/npm/noto-sans-sc@1.0.1/NotoSansSC-Regular.otf', 'NotoSansSC', 'normal')
    doc.setFont('NotoSansSC')

    // 添加标题
    doc.setFontSize(20)
    doc.text('商品价格数据', 14, 15)

    // 添加生成时间
    doc.setFontSize(10)
    doc.text(`生成时间：${new Date().toLocaleString()}`, 14, 25)

    // 准备表格数据
    const formattedData = formatData(data)
    const tableData = formattedData.map(item => [
      item.分类 || '',
      item.商品名称 || '',
      item.价格 || ''
    ])

    // 添加表格
    doc.autoTable({
      head: [['分类', '商品名称', '价格']],
      body: tableData,
      startY: 30,
      styles: {
        font: 'NotoSansSC',
        fontSize: 10
      },
      headStyles: {
        fillColor: [147, 51, 234],
        textColor: 255
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 80 },
        2: { cellWidth: 40 }
      },
      didDrawPage: (data: any) => {
        // 添加页脚
        doc.setFontSize(8)
        doc.text(
          `第 ${doc.getCurrentPageInfo().pageNumber} 页`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        )
      }
    })

    return doc.output('arraybuffer')
  }

  const processBatch = async (
    items: any[],
    format: ExportFormat,
    batchIndex: number
  ): Promise<Blob> => {
    const batchData = {
      [`批次${batchIndex + 1}`]: items
    }

    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(formatData(batchData), null, 2)], { 
          type: 'application/json' 
        })
      case 'csv':
        return new Blob([convertToCSV(batchData)], { 
          type: 'text/csv;charset=utf-8;' 
        })
      case 'excel':
        const excelContent = await convertToExcel(batchData)
        return new Blob([excelContent], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        })
      case 'pdf':
        const pdfContent = await convertToPDF(batchData)
        return new Blob([pdfContent], { 
          type: 'application/pdf' 
        })
      default:
        throw new Error('不支持的导出格式')
    }
  }

  const handleBatchExport = async (format: ExportFormat) => {
    setBatchProcessing(true)
    setIsExporting(true)
    setProgress(0)
    setActiveFormat(format)

    try {
      // 准备所有数据
      const validData = Object.entries(data).reduce((acc, [category, items]) => {
        if (category === '// 配置说明' || !Array.isArray(items)) {
          return acc
        }
        acc[category] = items
        return acc
      }, {} as Record<string, any[]>)

      const allItems = Object.entries(validData).flatMap(([category, items]) =>
        items.map(item => ({ ...item, category }))
      )

      // 计算批次数
      const batches = Math.ceil(allItems.length / batchSize)
      setTotalBatches(batches)

      // 按批次处理
      for (let i = 0; i < batches; i++) {
        setCurrentBatch(i + 1)
        const start = i * batchSize
        const end = Math.min(start + batchSize, allItems.length)
        const batchItems = allItems.slice(start, end)

        const blob = await processBatch(batchItems, format, i)
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}_batch${i + 1}.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        // 更新进度
        const progress = ((i + 1) / batches) * 100
        setProgress(progress)
        onBatchProgress?.(progress)

        // 等待一小段时间，避免浏览器过载
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      toast.success('批量导出完成')
    } catch (error) {
      console.error('Batch export failed:', error)
      toast.error('批量导出失败')
    } finally {
      setBatchProcessing(false)
      setIsExporting(false)
      setActiveFormat(null)
      setCurrentBatch(0)
      setTotalBatches(0)
      setProgress(0)
    }
  }

  const handleBatchExportClick = (format: ExportFormat) => {
    setPendingFormat(format)
    setShowConfirmDialog(true)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowFormats(prev => !prev)}
        disabled={isExporting}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <DownloadIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{isExporting ? '导出中...' : '导出数据'}</span>
        <span className="sm:hidden">导出</span>
      </button>

      {showFormats && (
        <>
          <div
            className="fixed inset-0 z-40 sm:bg-black/30"
            onClick={() => {
              setShowFormats(false)
              setShowOptions(false)
            }}
          />
          <div className="fixed sm:absolute inset-x-0 bottom-0 sm:bottom-auto sm:right-0 sm:inset-x-auto mt-2 w-full sm:w-80 bg-background rounded-t-lg sm:rounded-lg shadow-lg border z-50">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">导出选项</h3>
                <div className="space-x-2">
                  <button
                    onClick={handlePreview}
                    className="text-sm text-primary hover:underline"
                  >
                    预览数据
                  </button>
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="text-sm text-primary hover:underline"
                  >
                    {showOptions ? '隐藏选项' : '显示选项'}
                  </button>
                </div>
              </div>

              {showOptions && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">选择导出列</h4>
                    <div className="space-y-2">
                      {options.columns.map(col => (
                        <label key={col.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={col.selected}
                            onChange={e => {
                              setOptions(prev => ({
                                ...prev,
                                columns: prev.columns.map(c =>
                                  c.key === col.key ? { ...c, selected: e.target.checked } : c
                                )
                              }))
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">价格格式</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={options.format.price.addSymbol}
                          onChange={e => {
                            setOptions(prev => ({
                              ...prev,
                              format: {
                                ...prev.format,
                                price: {
                                  ...prev.format.price,
                                  addSymbol: e.target.checked
                                }
                              }
                            }))
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">添加货币符号 (¥)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">小数位数:</span>
                        <select
                          value={options.format.price.decimals}
                          onChange={e => {
                            setOptions(prev => ({
                              ...prev,
                              format: {
                                ...prev.format,
                                price: {
                                  ...prev.format.price,
                                  decimals: Number(e.target.value)
                                }
                              }
                            }))
                          }}
                          className="text-sm border rounded px-2 py-1"
                        >
                          {[0, 1, 2, 3, 4].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                  {[
                    { format: 'json', label: 'JSON 格式', icon: 'code' },
                    { format: 'csv', label: 'CSV 格式', icon: 'table' },
                    { format: 'excel', label: 'Excel 格式', icon: 'file-spreadsheet' },
                    { format: 'pdf', label: 'PDF 格式', icon: 'file-text' }
                  ].map(({ format, label }) => (
                    <div key={format} className="space-y-1">
                      <button
                        onClick={() => handleExport(format as ExportFormat)}
                        className="w-full flex items-center gap-2 px-4 py-3 sm:py-2 text-left hover:bg-accent transition-colors rounded-lg sm:rounded-none"
                      >
                        <span className="flex-1">{label}</span>
                        {isExporting && format === activeFormat && !batchProcessing && (
                          <LoadingSpinner className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          handleBatchExportClick(format as ExportFormat)
                        }}
                        className="w-full text-sm text-muted-foreground hover:text-foreground px-4 py-1 hover:bg-accent/50 rounded-lg transition-colors"
                      >
                        批量导出
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 批量处理进度 */}
              {batchProcessing && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>正在处理批次 {currentBatch}/{totalBatches}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    处理完成后，文件将自动下载
                  </p>
                </div>
              )}

              {/* 导出进度（非批量） */}
              {isExporting && !batchProcessing && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>导出进度</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {progress === 100 ? '导出完成' : '导出中...'}
                  </p>
                </div>
              )}

              {/* 批量导出设置 */}
              {showOptions && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">批量导出设置</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">每批数据量:</span>
                      <select
                        value={batchSize}
                        onChange={e => setBatchSize(Number(e.target.value))}
                        className="text-sm border rounded px-2 py-1"
                      >
                        {[100, 500, 1000, 2000, 5000].map(n => (
                          <option key={n} value={n}>{n} 条</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 预览对话框 */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowPreview(false)} />
          <div className="relative bg-background rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">数据预览</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted">
                  <tr>
                    {options.columns
                      .filter(col => col.selected)
                      .map(col => (
                        <th key={col.key} className="px-4 py-2 text-left">
                          {col.label}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => (
                    <tr key={index} className="border-t">
                      {options.columns
                        .filter(col => col.selected)
                        .map(col => (
                          <td key={col.key} className="px-4 py-2">
                            {item[col.label]}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  没有可预览的数据
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mt-4">
                  显示前 5 条数据（共 {formatData(data).length} 条）
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false)
          setPendingFormat(null)
        }}
        onConfirm={() => {
          if (pendingFormat) {
            handleBatchExport(pendingFormat)
          }
        }}
        title="批量导出确认"
        description={`确定要批量导出 ${pendingFormat?.toUpperCase()} 格式文件吗？每个文件将包含 ${batchSize} 条数据。`}
      />
    </div>
  )
} 