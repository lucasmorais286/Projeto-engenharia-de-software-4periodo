"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
  OnChangeFn,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table"
import { useState } from "react"
import { Input } from "@components/ui/input"
import { Button } from "@components/ui/button"
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Instagram, Calendar, User, FileText } from "lucide-react"
import { Separator } from "@components/ui/separator"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
  setSorting?: OnChangeFn<SortingState>
  setColumnFilters?: OnChangeFn<ColumnFiltersState>
  isPending: boolean
  allPagesLoaded: boolean
}

const getIconByHeader = (header: string) => {
  const iconMap = {
    'Conta': <Instagram size={16} className="text-gray-500" />,
    'Data': <Calendar size={16} className="text-gray-500" />,
    'Legenda': <FileText size={16} className="text-gray-500" />,
    'Usuário': <User size={16} className="text-gray-500" />,
  };

  return iconMap[header as keyof typeof iconMap] || null;
};

export function DataTable<TData, TValue>({
  isPending,
  allPagesLoaded,
  columns,
  data,
  pageSize = 10,
  totalItems = 0,
  sorting,
  columnFilters,
  setColumnFilters,
  setSorting
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useState(0);

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: (value) => { if (currentPage !== 0 && setCurrentPage) { setCurrentPage(0) }; setColumnFilters?.(value) },
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
    },
    pageCount: Math.ceil(totalItems / pageSize),
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({
          pageIndex: currentPage,
          pageSize,
        });
        if (newPagination.pageIndex !== currentPage) {
          setCurrentPage(newPagination.pageIndex);
        }
      }
    }
  })

  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="flex items-center justify-between p-6">
        <div className="text-sm text-gray-600">
          Quantidade de posts: {data.length}
          {!allPagesLoaded &&
            " (Carregando mais)"
          }
        </div>

        <div className="flex items-center gap-6">
          {table.getAllColumns().map((column) => {
            const header = column.columnDef.header as string;
            const icon = getIconByHeader(header);

            if (column.getCanFilter()) {
              return (
                <Input
                  key={column.id}
                  placeholder={`Filtrar ${header.toLowerCase()}`}
                  value={(column.getFilterValue() ?? '') as string}
                  onChange={(event) =>
                    column.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                  icon={icon}
                  disabled={isPending}
                />
              )
            }
          })}
        </div>
      </div>

      <Separator />

      <div className="px-6 pt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-white hover:bg-white">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <Button
                              variant="ghost"
                              onClick={() => header.column.toggleSorting()}
                              disabled={isPending}
                            >
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: columns.length }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-6 bg-gray-200 animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="truncate max-w-[200px]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center p-6 text-sm text-gray-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage() || isPending}
          className="hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isPending}
          className="hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="flex items-center gap-1 text-xs">
          <div className="text-muted-foreground">Página</div>
          {isPending ? (
            <div className="h-4 w-6 bg-gray-200 animate-pulse rounded" />
          ) : (
            <strong className="font-medium">
              {table.getState().pagination.pageIndex + 1}
            </strong>
          )}
          <div className="text-muted-foreground">de</div>
          {isPending ? (
            <div className="h-4 w-6 bg-gray-200 animate-pulse rounded" />
          ) : (
            <strong className="font-medium">
              {table.getPageCount()}
            </strong>
          )}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isPending}
          className="hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage() || isPending}
          className="hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
