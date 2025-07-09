'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResourceItem {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
  metadata?: React.ReactNode;
  actions?: ResourceAction[];
}

export interface ResourceAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: ResourceItem) => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  className?: string;
}

export interface ResourceBrowserProps {
  items: ResourceItem[];
  onSearch?: (value: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  filters?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
  gridCols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  renderItem?: (item: ResourceItem) => React.ReactNode;
}

export function ResourceBrowser({
  items,
  onSearch,
  searchValue = "",
  searchPlaceholder = "Search resources...",
  categories,
  selectedCategory,
  onCategoryChange,
  filters,
  emptyMessage = "No resources found.",
  className,
  gridCols = { default: 1, md: 2, lg: 3 },
  renderItem
}: ResourceBrowserProps) {
  const gridClasses = cn(
    "grid gap-4",
    gridCols.default && `grid-cols-${gridCols.default}`,
    gridCols.sm && `sm:grid-cols-${gridCols.sm}`,
    gridCols.md && `md:grid-cols-${gridCols.md}`,
    gridCols.lg && `lg:grid-cols-${gridCols.lg}`
  );

  // Group items by category if needed
  const groupedItems = React.useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') {
      // Group all items by category
      const groups: Record<string, ResourceItem[]> = {};
      items.forEach(item => {
        const cat = item.category || 'Uncategorized';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(item);
      });
      return groups;
    } else {
      // Show only selected category
      const filtered = items.filter(item => item.category === selectedCategory);
      return filtered.length > 0 ? { [selectedCategory]: filtered } : {};
    }
  }, [items, selectedCategory]);

  const defaultRenderItem = (item: ResourceItem) => (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          {item.icon}
          {item.title}
        </CardTitle>
        {item.description && (
          <CardDescription className="text-sm">
            {item.description}
          </CardDescription>
        )}
      </CardHeader>
      {(item.metadata || item.actions) && (
        <CardContent>
          {item.metadata && (
            <div className="mb-3 text-sm text-muted-foreground">
              {item.metadata}
            </div>
          )}
          {item.actions && (
            <div className="flex gap-2 flex-wrap">
              {item.actions.map((action, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant={action.variant || "outline"}
                  className={cn("flex-1", action.className)}
                  onClick={() => action.onClick(item)}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {onSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
              data-testid="resource-search-input"
            />
          </div>
        )}
        {categories && onCategoryChange && (
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(cat)}
                data-testid={`category-button-${cat.toLowerCase().replace(/\\s+/g, '-')}`}
              >
                {cat === 'all' ? 'All' : cat}
              </Button>
            ))}
          </div>
        )}
        {filters}
      </div>

      {/* Resource Grid */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([categoryName, categoryItems]) => (
            <div key={categoryName}>
              {(!selectedCategory || selectedCategory === 'all') && (
                <h3 className="text-lg font-semibold mb-4">{categoryName}</h3>
              )}
              <div className={gridClasses}>
                {categoryItems.map(item => 
                  renderItem ? renderItem(item) : defaultRenderItem(item)
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}