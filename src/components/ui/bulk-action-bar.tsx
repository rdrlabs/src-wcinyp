"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Trash2, Archive, MoreHorizontal, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface BulkActionBarProps {
  selectedCount: number
  onClearSelection: () => void
  onDownload?: () => void
  onDelete?: () => void
  onArchive?: () => void
  className?: string
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onDownload,
  onDelete,
  onArchive,
  className,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <Card
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 p-4 shadow-lg animate-in slide-in-from-bottom-4 duration-300",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear selection</span>
        </Button>
      </div>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-2">
        {onDownload && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}

        {onArchive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onArchive}
            className="gap-2"
          >
            <Archive className="h-4 w-4" />
            Archive
          </Button>
        )}

        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <MoreHorizontal className="h-4 w-4" />
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Move to folder</DropdownMenuItem>
            <DropdownMenuItem>Add tags</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}