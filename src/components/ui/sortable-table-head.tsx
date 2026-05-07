import React from 'react';
import { TableHead } from '@/components/ui/table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { SortConfig } from '@/lib/useSortableData';

interface SortableTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortKey: string;
  sortConfig: SortConfig | null;
  requestSort: (key: string) => void;
  children: React.ReactNode;
}

export function SortableTableHead({
  sortKey,
  sortConfig,
  requestSort,
  children,
  className,
  ...props
}: SortableTableHeadProps) {
  const isActive = sortConfig?.key === sortKey;
  const isAsc = isActive && sortConfig.direction === 'asc';

  return (
    <TableHead
      className={`cursor-pointer select-none hover:bg-muted/50 ${className || ''}`}
      onClick={() => requestSort(sortKey)}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {isActive ? (
          isAsc ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 text-muted-foreground/50" />
        )}
      </div>
    </TableHead>
  );
}
