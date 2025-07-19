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
import { logger } from "@/lib/logger-v2"

// Types

/**
 * Properties for SortableHeader component
 * @interface SortableHeaderProps
 * @property {Column<any, any>} column - TanStack Table column instance for sorting operations
 * @property {string} title - Display title for the column header
 * @property {string} [className] - Optional CSS classes for styling
 */
export interface SortableHeaderProps {
  column: Column<any, any>
  title: string
  className?: string
}

/**
 * Configuration for action menu items
 * @interface ActionItem
 * @template TData - Type of the row data
 * @property {string} label - Display text for the action
 * @property {Function} onClick - Handler called when action is clicked
 * @property {React.ReactNode} [icon] - Optional icon to display with the action
 * @property {boolean} [destructive] - If true, styles action as destructive (red)
 * @property {boolean | Function} [disabled] - Static or dynamic disable state
 * @property {boolean | Function} [hidden] - Static or dynamic visibility state
 */
export interface ActionItem<TData = any> {
  label: string
  onClick: (row: TData) => void
  icon?: React.ReactNode
  destructive?: boolean
  disabled?: boolean | ((row: TData) => boolean)
  hidden?: boolean | ((row: TData) => boolean)
}

/**
 * Properties for ActionsColumn component
 * @interface ActionsColumnProps
 * @template TData - Type of the row data
 * @property {ActionItem<TData>[]} actions - Array of actions to display in dropdown
 * @property {TData} row - Current row data
 * @property {"start" | "center" | "end"} [align="end"] - Dropdown menu alignment
 */
export interface ActionsColumnProps<TData = any> {
  actions: ActionItem<TData>[]
  row: TData
  align?: "start" | "center" | "end"
}

/**
 * Properties for StatusBadge component
 * @interface StatusBadgeProps
 * @property {string} status - Status text to display
 * @property {string} [variant="default"] - Visual style variant
 * @property {React.ReactNode} [icon] - Custom icon (auto-detected if not provided)
 * @property {"sm" | "md" | "lg"} [size="md"] - Badge size
 * @property {string} [className] - Additional CSS classes
 */
export interface StatusBadgeProps {
  status: string
  variant?: "default" | "success" | "warning" | "error" | "info" | "secondary"
  icon?: React.ReactNode
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Properties for ContactInfo component
 * @interface ContactInfoProps
 * @property {string} [email] - Email address to display
 * @property {string} [phone] - Phone number to display
 * @property {string} [name] - Contact name to display
 * @property {boolean} [compact=false] - Use compact layout with icons
 * @property {boolean} [showCopyButton=false] - Show copy to clipboard buttons
 * @property {string} [className] - Additional CSS classes
 */
export interface ContactInfoProps {
  email?: string
  phone?: string
  name?: string
  compact?: boolean
  showCopyButton?: boolean
  className?: string
}

/**
 * Properties for DateDisplay component
 * @interface DateDisplayProps
 * @property {string | Date | null | undefined} date - Date value to display
 * @property {string} [format="MMM d, yyyy"] - date-fns format string
 * @property {boolean} [relative=false] - Show relative time (e.g., "2 hours ago")
 * @property {boolean} [showTime=false] - Include time in display
 * @property {string} [className] - Additional CSS classes
 */
export interface DateDisplayProps {
  date: string | Date | null | undefined
  format?: string
  relative?: boolean
  showTime?: boolean
  className?: string
}

/**
 * Properties for FileInfo component
 * @interface FileInfoProps
 * @property {string} filename - Name of the file
 * @property {number} [size] - File size in bytes
 * @property {string} [type] - File extension/type (auto-detected from filename if not provided)
 * @property {Function} [onDownload] - Download click handler
 * @property {Function} [onPreview] - Preview click handler
 * @property {boolean} [truncate=true] - Truncate long filenames with tooltip
 * @property {string} [className] - Additional CSS classes
 */
export interface FileInfoProps {
  filename: string
  size?: number
  type?: string
  onDownload?: () => void
  onPreview?: () => void
  truncate?: boolean
  className?: string
}

/**
 * Sortable table header with visual indicators
 * 
 * @component
 * @param {SortableHeaderProps} props - Component properties
 * @returns {JSX.Element} Sortable header button
 * 
 * @example
 * ```tsx
 * // In your column definition
 * {
 *   accessorKey: "name",
 *   header: ({ column }) => (
 *     <SortableHeader column={column} title="Name" />
 *   ),
 * }
 * ```
 * 
 * @remarks
 * - Shows arrow up/down icons for sorted state
 * - Shows bi-directional arrow when not sorted
 * - Toggles between asc/desc/no sort on click
 */
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

/**
 * Dropdown menu for row actions in tables
 * 
 * @component
 * @template TData - Type of the row data
 * @param {ActionsColumnProps<TData>} props - Component properties
 * @returns {JSX.Element | null} Actions dropdown or null if no visible actions
 * 
 * @example
 * ```tsx
 * // In your column definition
 * {
 *   id: "actions",
 *   cell: ({ row }) => (
 *     <ActionsColumn
 *       row={row.original}
 *       actions={[
 *         {
 *           label: "Edit",
 *           onClick: (data) => handleEdit(data),
 *           icon: <Edit className="h-4 w-4" />
 *         },
 *         {
 *           label: "Delete",
 *           onClick: (data) => handleDelete(data),
 *           icon: <Trash className="h-4 w-4" />,
 *           destructive: true,
 *           disabled: (data) => !data.canDelete
 *         }
 *       ]}
 *     />
 *   ),
 * }
 * ```
 * 
 * @remarks
 * - Filters out hidden actions dynamically
 * - Supports conditional disable/hide based on row data
 * - Stops event propagation to prevent row click handlers
 */
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

/**
 * Status indicator badge with automatic icon detection
 * 
 * @component
 * @param {StatusBadgeProps} props - Component properties
 * @returns {JSX.Element} Styled status badge
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <StatusBadge status="Active" variant="success" />
 * 
 * // With custom icon
 * <StatusBadge 
 *   status="Processing" 
 *   variant="info"
 *   icon={<Loader className="h-3 w-3 animate-spin" />}
 * />
 * 
 * // Different sizes
 * <StatusBadge status="Error" variant="error" size="sm" />
 * ```
 * 
 * @remarks
 * - Auto-detects icons based on status text keywords
 * - Keywords: success/complete/active, error/fail, warning/pending, processing/loading
 * - Uses theme-aware colors for light/dark mode
 */
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

/**
 * Display contact information with optional copy functionality
 * 
 * @component
 * @param {ContactInfoProps} props - Component properties
 * @returns {JSX.Element} Contact information display
 * 
 * @example
 * ```tsx
 * // Full display
 * <ContactInfo
 *   name="John Doe"
 *   email="john@example.com"
 *   phone="(555) 123-4567"
 *   showCopyButton
 * />
 * 
 * // Compact display with icons
 * <ContactInfo
 *   email="jane@example.com"
 *   phone="(555) 987-6543"
 *   compact
 * />
 * ```
 * 
 * @remarks
 * - Shows em dash (—) when all fields are empty
 * - Compact mode uses inline layout with icons
 * - Copy buttons show confirmation checkmark briefly
 * - Email addresses truncate in compact mode with tooltip
 */
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
      logger.error("Failed to copy to clipboard", { error: err })
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

/**
 * Flexible date display with formatting and relative time options
 * 
 * @component
 * @param {DateDisplayProps} props - Component properties
 * @returns {JSX.Element} Formatted date display
 * 
 * @example
 * ```tsx
 * // Basic date
 * <DateDisplay date={new Date()} />
 * 
 * // With custom format and time
 * <DateDisplay 
 *   date="2024-01-15T14:30:00Z" 
 *   format="MMMM d, yyyy"
 *   showTime 
 * />
 * 
 * // Relative time with tooltip
 * <DateDisplay date={someDate} relative />
 * ```
 * 
 * @remarks
 * - Handles Date objects and ISO date strings
 * - Shows em dash (—) for null/undefined dates
 * - Shows "Invalid date" for unparseable values
 * - Relative mode shows tooltip with absolute date on hover
 * - Uses date-fns for formatting and relative time
 */
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

/**
 * File type to icon mapping for common extensions
 * @const {Record<string, React.ReactNode>}
 */
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

/**
 * File information display with type-specific icons and actions
 * 
 * @component
 * @param {FileInfoProps} props - Component properties
 * @returns {JSX.Element} File info with icon and actions
 * 
 * @example
 * ```tsx
 * // Basic file display
 * <FileInfo filename="document.pdf" size={1024000} />
 * 
 * // With actions
 * <FileInfo
 *   filename="report.xlsx"
 *   size={2048000}
 *   onDownload={() => downloadFile("report.xlsx")}
 *   onPreview={() => previewFile("report.xlsx")}
 * />
 * 
 * // Custom type override
 * <FileInfo
 *   filename="data.custom"
 *   type="csv"
 *   size={512000}
 * />
 * ```
 * 
 * @remarks
 * - Auto-detects file type from extension
 * - Shows appropriate icon for common file types
 * - Formats file size (Bytes, KB, MB, GB)
 * - Truncates long filenames with full name in tooltip
 * - Action buttons stop event propagation
 */
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
  
  /**
   * Format file size in human-readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted size string
   */
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

/**
 * Properties for ProgressBar component
 * @interface ProgressBarProps
 * @property {number} value - Current progress value
 * @property {number} [max=100] - Maximum value for percentage calculation
 * @property {boolean} [showLabel=true] - Show percentage label
 * @property {string} [variant="default"] - Visual style variant
 * @property {string} [className] - Additional CSS classes
 */
export interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  variant?: "default" | "success" | "warning" | "error"
  className?: string
}

/**
 * Progress bar for displaying completion status in tables
 * 
 * @component
 * @param {ProgressBarProps} props - Component properties
 * @returns {JSX.Element} Progress bar with optional label
 * 
 * @example
 * ```tsx
 * // Basic progress
 * <ProgressBar value={75} />
 * 
 * // Custom max value
 * <ProgressBar value={3} max={5} />
 * 
 * // Different variants
 * <ProgressBar value={90} variant="success" />
 * <ProgressBar value={30} variant="warning" />
 * 
 * // Without label
 * <ProgressBar value={50} showLabel={false} />
 * ```
 * 
 * @remarks
 * - Calculates percentage based on value/max
 * - Smooth transitions on value changes
 * - Theme-aware color variants
 * - Tabular number formatting for consistent width
 */
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