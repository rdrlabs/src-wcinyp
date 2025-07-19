"use client"

import * as React from "react"
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { Calendar as CalendarIcon, ChevronsUpDown, X, Search, Filter, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
export interface TableSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onClear?: () => void
  debounceMs?: number
}

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  presets?: Array<{
    label: string
    getValue: () => DateRange
  }>
  className?: string
  placeholder?: string
}

export interface MultiSelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  maxHeight?: number
}

export interface ColumnVisibilityOption {
  id: string
  label: string
  group?: string
}

export interface ColumnVisibilityMenuProps {
  columns: ColumnVisibilityOption[]
  visibility: Record<string, boolean>
  onChange: (visibility: Record<string, boolean>) => void
  className?: string
}

export interface FilterConfig {
  type: 'search' | 'date-range' | 'multi-select' | 'select'
  key: string
  label: string
  placeholder?: string
  options?: MultiSelectOption[]
  value?: any
}

export interface TableFiltersProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  onClearAll?: () => void
  className?: string
}

// Utility: Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Component: TableSearch
export function TableSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
  onClear,
  debounceMs = 300,
}: TableSearchProps) {
  const [localValue, setLocalValue] = React.useState(value)
  const debouncedValue = useDebounce(localValue, debounceMs)

  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue("")
    onChange("")
    onClear?.()
  }

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {localValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}

// Component: DateRangePicker
const defaultPresets = [
  {
    label: "Today",
    getValue: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Yesterday",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    label: "Last 7 days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 7)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 30)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "This month",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last month",
    getValue: () => {
      const lastMonth = subDays(startOfMonth(new Date()), 1)
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      }
    },
  },
  {
    label: "This year",
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
]

export function DateRangePicker({
  value,
  onChange,
  presets = defaultPresets,
  className,
  placeholder = "Select date range",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const displayValue = React.useMemo(() => {
    if (!value.from) return placeholder
    if (!value.to) return format(value.from, "MMM d, yyyy")
    return `${format(value.from, "MMM d, yyyy")} - ${format(value.to, "MMM d, yyyy")}`
  }, [value, placeholder])

  const handlePresetClick = (preset: typeof presets[0]) => {
    onChange(preset.getValue())
    setOpen(false)
  }

  const handleClear = () => {
    onChange({ from: undefined, to: undefined })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
          {value.from && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2" align="start">
        <div className="flex gap-2">
          <div className="grid gap-2">
            <div className="grid gap-1">
              {presets.map((preset, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePresetClick(preset)}
                  className="justify-start"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Calendar
              mode="range"
              selected={value}
              onSelect={(selected) => {
                if (selected) {
                  onChange(selected as DateRange)
                }
              }}
              numberOfMonths={2}
              initialFocus
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Component: MultiSelect
export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select items...",
  className,
  maxHeight = 300,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    const searchLower = search.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchLower)
    )
  }, [options, search])

  const handleSelectAll = () => {
    onChange(options.map((opt) => opt.value))
  }

  const handleClearAll = () => {
    onChange([])
  }

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const selectedLabels = React.useMemo(() => {
    return value
      .map((v) => options.find((opt) => opt.value === v)?.label)
      .filter(Boolean)
  }, [value, options])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          <span className="truncate">
            {value.length === 0
              ? placeholder
              : value.length === 1
              ? selectedLabels[0]
              : `${value.length} selected`}
          </span>
          <div className="ml-2 flex items-center gap-1">
            {value.length > 0 && (
              <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                {value.length}
              </Badge>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              <div className="flex items-center justify-between px-2 py-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-auto p-1 text-xs"
                >
                  Select all
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-auto p-1 text-xs"
                >
                  Clear all
                </Button>
              </div>
              <CommandSeparator />
              <ScrollArea className={cn("max-h-64", maxHeight && `max-h-[${maxHeight}px]`)}>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleToggle(option.value)}
                  >
                    <Checkbox
                      checked={value.includes(option.value)}
                      className="mr-2"
                    />
                    {option.icon && (
                      <span className="mr-2">{option.icon}</span>
                    )}
                    {option.label}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Component: ColumnVisibilityMenu
export function ColumnVisibilityMenu({
  columns,
  visibility,
  onChange,
  className,
}: ColumnVisibilityMenuProps) {
  const [search, setSearch] = React.useState("")

  const groups = React.useMemo(() => {
    const grouped: Record<string, ColumnVisibilityOption[]> = {
      "": [], // Default group for ungrouped columns
    }

    columns.forEach((column) => {
      const group = column.group || ""
      if (!grouped[group]) {
        grouped[group] = []
      }
      grouped[group].push(column)
    })

    return grouped
  }, [columns])

  const filteredColumns = React.useMemo(() => {
    if (!search) return columns
    const searchLower = search.toLowerCase()
    return columns.filter((column) =>
      column.label.toLowerCase().includes(searchLower)
    )
  }, [columns, search])

  const visibleCount = React.useMemo(() => {
    return columns.filter((col) => visibility[col.id] !== false).length
  }, [columns, visibility])

  const handleToggleAll = (show: boolean) => {
    const newVisibility: Record<string, boolean> = {}
    columns.forEach((col) => {
      newVisibility[col.id] = show
    })
    onChange(newVisibility)
  }

  const handleReset = () => {
    onChange({})
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("ml-auto", className)}>
          <Filter className="mr-2 h-4 w-4" />
          Columns
          {visibleCount < columns.length && (
            <Badge variant="secondary" className="ml-2 rounded-sm px-1">
              {visibleCount}/{columns.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-2">
          <Input
            placeholder="Search columns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleAll(true)}
            className="h-auto p-1 text-xs"
          >
            Show all
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleAll(false)}
            className="h-auto p-1 text-xs"
          >
            Hide all
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-auto p-1 text-xs"
          >
            Reset
          </Button>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-64">
          <DropdownMenuGroup>
            {search ? (
              // Show filtered results without groups
              filteredColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={visibility[column.id] !== false}
                  onCheckedChange={(checked) =>
                    onChange({ ...visibility, [column.id]: checked })
                  }
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              // Show grouped columns
              Object.entries(groups).map(([group, groupColumns]) => (
                <React.Fragment key={group}>
                  {group && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                        {group}
                      </DropdownMenuLabel>
                    </>
                  )}
                  {groupColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={visibility[column.id] !== false}
                      onCheckedChange={(checked) =>
                        onChange({ ...visibility, [column.id]: checked })
                      }
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </React.Fragment>
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Component: TableFilters
export function TableFilters({
  filters,
  values,
  onChange,
  onClearAll,
  className,
}: TableFiltersProps) {
  const activeFiltersCount = React.useMemo(() => {
    return filters.filter((filter) => {
      const value = values[filter.key]
      if (!value) return false
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object' && 'from' in value) {
        return value.from || value.to
      }
      return true
    }).length
  }, [filters, values])

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll()
    } else {
      // Clear all filter values
      filters.forEach((filter) => {
        onChange(filter.key, filter.type === 'multi-select' ? [] : '')
      })
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          switch (filter.type) {
            case 'search':
              return (
                <TableSearch
                  key={filter.key}
                  value={values[filter.key] || ''}
                  onChange={(value) => onChange(filter.key, value)}
                  placeholder={filter.placeholder || filter.label}
                  className="w-64"
                />
              )

            case 'date-range':
              return (
                <DateRangePicker
                  key={filter.key}
                  value={values[filter.key] || { from: undefined, to: undefined }}
                  onChange={(value) => onChange(filter.key, value)}
                  placeholder={filter.placeholder || filter.label}
                />
              )

            case 'multi-select':
              return (
                <MultiSelect
                  key={filter.key}
                  options={filter.options || []}
                  value={values[filter.key] || []}
                  onChange={(value) => onChange(filter.key, value)}
                  placeholder={filter.placeholder || filter.label}
                  className="w-64"
                />
              )

            default:
              return null
          }
        })}

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-8 px-2 lg:px-3"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear filters
            <Badge variant="secondary" className="ml-2 rounded-sm px-1">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  )
}

// Export a hook for managing filter state
export function useTableFilters<T extends Record<string, any>>(
  initialValues: T
): {
  values: T
  setFilter: (key: keyof T, value: any) => void
  clearFilters: () => void
  activeCount: number
} {
  const [values, setValues] = React.useState<T>(initialValues)

  const setFilter = React.useCallback((key: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = React.useCallback(() => {
    setValues(initialValues)
  }, [initialValues])

  const activeCount = React.useMemo(() => {
    return Object.entries(values).filter(([_, value]) => {
      if (!value) return false
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object' && 'from' in value) {
        return value.from || value.to
      }
      return true
    }).length
  }, [values])

  return {
    values,
    setFilter,
    clearFilters,
    activeCount,
  }
}