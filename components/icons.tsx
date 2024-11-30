"use client"

import dynamic from 'next/dynamic'

// 动态导入所有图标
const Sun = dynamic(() => import('lucide-react').then(mod => mod.Sun), { ssr: false })
const Moon = dynamic(() => import('lucide-react').then(mod => mod.Moon), { ssr: false })
const Search = dynamic(() => import('lucide-react').then(mod => mod.Search), { ssr: false })
const LogOut = dynamic(() => import('lucide-react').then(mod => mod.LogOut), { ssr: false })
const Menu = dynamic(() => import('lucide-react').then(mod => mod.Menu), { ssr: false })
const X = dynamic(() => import('lucide-react').then(mod => mod.X), { ssr: false })
const ChevronLeft = dynamic(() => import('lucide-react').then(mod => mod.ChevronLeft), { ssr: false })
const ChevronRight = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight), { ssr: false })
const ChevronUp = dynamic(() => import('lucide-react').then(mod => mod.ChevronUp), { ssr: false })
const ChevronDown = dynamic(() => import('lucide-react').then(mod => mod.ChevronDown), { ssr: false })
const Plus = dynamic(() => import('lucide-react').then(mod => mod.Plus), { ssr: false })
const Edit2 = dynamic(() => import('lucide-react').then(mod => mod.Edit2), { ssr: false })
const Trash2 = dynamic(() => import('lucide-react').then(mod => mod.Trash2), { ssr: false })
const Download = dynamic(() => import('lucide-react').then(mod => mod.Download), { ssr: false })
const FileUp = dynamic(() => import('lucide-react').then(mod => mod.FileUp), { ssr: false })
const Settings = dynamic(() => import('lucide-react').then(mod => mod.Settings), { ssr: false })
const AlertTriangle = dynamic(() => import('lucide-react').then(mod => mod.AlertTriangle), { ssr: false })
const Clock = dynamic(() => import('lucide-react').then(mod => mod.Clock), { ssr: false })
const TrendingUp = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp), { ssr: false })
const TrendingDown = dynamic(() => import('lucide-react').then(mod => mod.TrendingDown), { ssr: false })
const Minus = dynamic(() => import('lucide-react').then(mod => mod.Minus), { ssr: false })
const Tag = dynamic(() => import('lucide-react').then(mod => mod.Tag), { ssr: false })
const Package = dynamic(() => import('lucide-react').then(mod => mod.Package), { ssr: false })
const BarChart = dynamic(() => import('lucide-react').then(mod => mod.BarChart), { ssr: false })
const User = dynamic(() => import('lucide-react').then(mod => mod.User), { ssr: false })
const Mail = dynamic(() => import('lucide-react').then(mod => mod.Mail), { ssr: false })
const Calendar = dynamic(() => import('lucide-react').then(mod => mod.Calendar), { ssr: false })

// 创建一个包装组件来处理加载状态
interface IconProps {
  className?: string
  size?: number
}

export function SunIcon(props: IconProps) {
  return <Sun {...props} />
}

export function MoonIcon(props: IconProps) {
  return <Moon {...props} />
}

export function SearchIcon(props: IconProps) {
  return <Search {...props} />
}

export function LogOutIcon(props: IconProps) {
  return <LogOut {...props} />
}

export function MenuIcon(props: IconProps) {
  return <Menu {...props} />
}

export function XIcon(props: IconProps) {
  return <X {...props} />
}

export function ChevronLeftIcon(props: IconProps) {
  return <ChevronLeft {...props} />
}

export function ChevronRightIcon(props: IconProps) {
  return <ChevronRight {...props} />
}

export function ChevronUpIcon(props: IconProps) {
  return <ChevronUp {...props} />
}

export function ChevronDownIcon(props: IconProps) {
  return <ChevronDown {...props} />
}

export function PlusIcon(props: IconProps) {
  return <Plus {...props} />
}

export function Edit2Icon(props: IconProps) {
  return <Edit2 {...props} />
}

export function Trash2Icon(props: IconProps) {
  return <Trash2 {...props} />
}

export function DownloadIcon(props: IconProps) {
  return <Download {...props} />
}

export function FileUpIcon(props: IconProps) {
  return <FileUp {...props} />
}

export function SettingsIcon(props: IconProps) {
  return <Settings {...props} />
}

export function AlertTriangleIcon(props: IconProps) {
  return <AlertTriangle {...props} />
}

export function ClockIcon(props: IconProps) {
  return <Clock {...props} />
}

export function TrendingUpIcon(props: IconProps) {
  return <TrendingUp {...props} />
}

export function TrendingDownIcon(props: IconProps) {
  return <TrendingDown {...props} />
}

export function MinusIcon(props: IconProps) {
  return <Minus {...props} />
}

export function TagIcon(props: IconProps) {
  return <Tag {...props} />
}

export function PackageIcon(props: IconProps) {
  return <Package {...props} />
}

export function BarChartIcon(props: IconProps) {
  return <BarChart {...props} />
}

export function UserIcon(props: IconProps) {
  return <User {...props} />
}

export function MailIcon(props: IconProps) {
  return <Mail {...props} />
}

export function CalendarIcon(props: IconProps) {
  return <Calendar {...props} />
} 