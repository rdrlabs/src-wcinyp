'use client';

import { useAppTheme } from '@/contexts/app-context';
import { cn } from '@/lib/utils';

interface BrandNameProps {
  className?: string;
}

export function BrandName({ className }: BrandNameProps) {
  return (
    <span className={cn("transition-colors", className)}>
      WCI
      <span className="text-primary transition-colors duration-300">@</span>
      NYP
    </span>
  );
}