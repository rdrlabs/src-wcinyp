"use client"

import * as React from "react"
import { Column } from "@tanstack/react-table"
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns"
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  MoreHorizontal,
  Mail,
  Phone,
  Copy,
  Download,
  Eye,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  File,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Types
export interface SortableHeaderProps {
  column: Column<any, any>
  title: string
  className?: string
}

export interface ActionItem<TData = any> {
  label: string
  onClick: (row: TData) => void
  icon?: React.ReactNode
  destructive?: boolean
  disabled?: boolean | ((row: TData) => boolean)
  hidden?: boolean | ((row: TData) => boolean)
}

export interface ActionsColumnProps<TData = any> {
  actions: ActionItem<TData>[]
  row: TData
  align?: "start" | "center" | "end"
}

export interface StatusBadgeProps {
  status: string
  variant?: "default" | "success" | "warning" | "error" | "info" | "secondary"
  icon?: React.ReactNode
  size?: "sm" | "md" | "lg"
  className?: string
}

export interface ContactInfoProps {
  email?: string
  phone?: string
  name?: string
  compact?: boolean
  showCopyButton?: boolean
  className?: string
}

export interface DateDisplayProps {
  date: string | Date | null | undefined
  format?: string
  relative?: boolean
  showTime?: boolean
  className?: string
}

export interface FileInfoProps {
  filename: string
  size?: number
  type?: string
  onDownload?: () => void
  onPreview?: () => void
  truncate?: boolean
  className?: string
}

// Component: SortableHeader
export function SortableHeader({ column, title, className }: SortableHeaderProps) {
  const sorted = column.getIsSorted()
  
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn("-ml-4 h-auto hover:bg-transparent", className)}
    >
      {title}
      <span className="ml-2">
        {sorted === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : sorted === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        )}
      </span>
    </Button>
  )
}

// Component: ActionsColumn
export function ActionsColumn<TData = any>({ 
  actions, 
  row, 
  align = "end" 
}: ActionsColumnProps<TData>) {
  // Filter out hidden actions
  const visibleActions = actions.filter(action => {
    if (typeof action.hidden === "function") {
      return !action.hidden(row)
    }
    return !action.hidden
  })

  if (visibleActions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-[160px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleActions.map((action, index) => {
          const isDisabled = typeof action.disabled === "function"
            ? action.disabled(row)
            : action.disabled

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => {
                if (!isDisabled) {
                  action.onClick(row)
                }
              }}
              disabled={isDisabled}
              className={cn(
                action.destructive && "text-destructive focus:text-destructive"
              )}
            >
              {action.icon && (
                <span className="mr-2 h-4 w-4">{action.icon}</span>
              )}
              {action.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Component: StatusBadge
const statusVariants = {
  default: "bg-muted text-muted-foreground",
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  secondary: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

const statusIcons = {
  success: <CheckCircle2 className="h-3 w-3" />,
  warning: <AlertCircle className="h-3 w-3" />,
  error: <XCircle className="h-3 w-3" />,
  info: <AlertCircle className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
  processing: <RefreshCw className="h-3 w-3 animate-spin" />,
}

export function StatusBadge({ 
  status, 
  variant = "default", 
  icon,
  size = "md",
  className 
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  }

  // Auto-detect icon based on common status names
  const autoIcon = !icon && (
    status.toLowerCase().includes("success") || 
    status.toLowerCase().includes("complete") ||
    status.toLowerCase().includes("active")
  ) ? statusIcons.success :
    (status.toLowerCase().includes("error") || 
     status.toLowerCase().includes("fail")) ? statusIcons.error :
    (status.toLowerCase().includes("warning") ||
     status.toLowerCase().includes("pending")) ? statusIcons.warning :
    (status.toLowerCase().includes("processing") ||
     status.toLowerCase().includes("loading")) ? statusIcons.processing :
    null

  return (
    <Badge
      className={cn(
        statusVariants[variant],
        sizeClasses[size],
        "inline-flex items-center gap-1.5 font-medium",
        className
      )}
    >
      {(icon || autoIcon) && (
        <span className="flex-shrink-0">{icon || autoIcon}</span>
      )}
      {status}
    </Badge>
  )
}

// Component: ContactInfo
export function ContactInfo({ 
  email, 
  phone, 
  name,
  compact = false,
  showCopyButton = false,
  className 
}: ContactInfoProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null)

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (!email && !phone && !name) {
    return <span className="text-muted-foreground">—</span>
  }

  if (compact) {
    return (
      <div className={cn("text-sm", className)}>
        {name && <div className="font-medium">{name}</div>}
        <div className="flex items-center gap-3 text-muted-foreground">
          {email && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => showCopyButton && handleCopy(email, "email")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Mail className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">{email}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{email}</p>
                  {showCopyButton && <p className="text-xs">Click to copy</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {phone && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => showCopyButton && handleCopy(phone, "phone")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{phone}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {showCopyButton && <p className="text-xs">Click to copy</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-1 text-sm", className)}>
      {name && <div className="font-medium">{name}</div>}
      {email && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{email}</span>
          {showCopyButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleCopy(email, "email")}
            >
              {copiedField === "email" ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{phone}</span>
          {showCopyButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleCopy(phone, "phone")}
            >
              {copiedField === "phone" ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Component: DateDisplay
export function DateDisplay({ 
  date, 
  format: dateFormat = "MMM d, yyyy",
  relative = false,
  showTime = false,
  className 
}: DateDisplayProps) {
  if (!date) {
    return <span className="text-muted-foreground">—</span>
  }

  const parsedDate = date instanceof Date ? date : parseISO(String(date))
  
  if (!isValid(parsedDate)) {
    return <span className="text-muted-foreground">Invalid date</span>
  }

  const fullFormat = showTime ? `${dateFormat} 'at' h:mm a` : dateFormat
  const formatted = format(parsedDate, fullFormat)
  const relativeTime = formatDistanceToNow(parsedDate, { addSuffix: true })

  if (relative) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn("cursor-help", className)}>
              {relativeTime}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formatted}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return <span className={className}>{formatted}</span>
}

// Component: FileInfo
const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-4 w-4 text-red-600" />,
  doc: <FileText className="h-4 w-4 text-blue-600" />,
  docx: <FileText className="h-4 w-4 text-blue-600" />,
  xls: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
  xlsx: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
  csv: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
  png: <FileImage className="h-4 w-4 text-purple-600" />,
  jpg: <FileImage className="h-4 w-4 text-purple-600" />,
  jpeg: <FileImage className="h-4 w-4 text-purple-600" />,
  gif: <FileImage className="h-4 w-4 text-purple-600" />,
  svg: <FileImage className="h-4 w-4 text-purple-600" />,
  mp4: <FileVideo className="h-4 w-4 text-orange-600" />,
  avi: <FileVideo className="h-4 w-4 text-orange-600" />,
  mov: <FileVideo className="h-4 w-4 text-orange-600" />,
  mp3: <FileAudio className="h-4 w-4 text-pink-600" />,
  wav: <FileAudio className="h-4 w-4 text-pink-600" />,
  zip: <FileArchive className="h-4 w-4 text-yellow-600" />,
  rar: <FileArchive className="h-4 w-4 text-yellow-600" />,
  js: <FileCode className="h-4 w-4 text-yellow-500" />,
  ts: <FileCode className="h-4 w-4 text-blue-500" />,
  jsx: <FileCode className="h-4 w-4 text-cyan-500" />,
  tsx: <FileCode className="h-4 w-4 text-cyan-500" />,
}

export function FileInfo({ 
  filename, 
  size,
  type,
  onDownload,
  onPreview,
  truncate = true,
  className 
}: FileInfoProps) {
  const extension = type || filename.split('.').pop()?.toLowerCase() || ''
  const icon = fileIcons[extension] || <File className="h-4 w-4 text-gray-500" />
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const displayName = truncate && filename.length > 30
    ? filename.substring(0, 27) + '...'
    : filename

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium truncate">{displayName}</div>
            </TooltipTrigger>
            {truncate && filename.length > 30 && (
              <TooltipContent>
                <p>{filename}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        {size !== undefined && (
          <div className="text-xs text-muted-foreground">
            {formatFileSize(size)}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {onPreview && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onPreview()
            }}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Preview</span>
          </Button>
        )}
        {onDownload && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onDownload()
            }}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        )}
      </div>
    </div>
  )
}

// Additional utility component for progress bars in tables
export interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  variant?: "default" | "success" | "warning" | "error"
  className?: string
}

export function ProgressBar({ 
  value, 
  max = 100,
  showLabel = true,
  variant = "default",
  className 
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100)
  
  const variantClasses = {
    default: "bg-primary",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    error: "bg-red-600",
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium tabular-nums w-12 text-right">
          {percentage}%
        </span>
      )}
    </div>
  )
}