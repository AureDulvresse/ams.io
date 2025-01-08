"use client"
import { useState, useCallback } from "react"
import {
   ColumnDef,
   flexRender,
   getCoreRowModel,
   useReactTable,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   SortingState,
   VisibilityState,
   ColumnFiltersState,
} from "@tanstack/react-table"
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   DropdownMenuCheckboxItem,
   DropdownMenuLabel,
   DropdownMenuSeparator
} from "@/src/components/ui/dropdown-menu"
import {
   Download,
   FileDown,
   Search,
   Plus,
   MoreHorizontal,
   Eye,
   Settings,
   Frown,
   Pencil,
   Trash2,
   ChevronDown,
   ChevronUp,
   Filter
} from "lucide-react"
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Skeleton } from "@/src/components/ui/skeleton"
import { cn } from "@/src/lib/utils"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/src/components/ui/select"
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/src/components/ui/tooltip"

interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[]
   data: TData[]
   loading?: boolean
   onView?: (row: TData) => void
   onEdit?: (row: TData) => void
   onDelete?: (row: TData) => void
   onAdd?: () => void
   pageSize?: number
   title?: string
   description?: string
   itemsPerPageOptions?: number[]
   enableRowSelection?: boolean
   enableColumnFilters?: boolean
   enableGlobalFilter?: boolean
   enablePagination?: boolean
   enableSorting?: boolean
   toolbarCustomContent?: React.ReactNode
   onRowClick?: (row: TData) => void
   noDataMessage?: string
}

export function DataTable<TData, TValue>({
   columns,
   data,
   loading = false,
   onView,
   onEdit,
   onDelete,
   onAdd,
   pageSize = 10,
   title,
   description,
   itemsPerPageOptions = [5, 10, 20, 50],
   enableRowSelection = false,
   enableColumnFilters = true,
   enableGlobalFilter = true,
   enablePagination = true,
   enableSorting = true,
   toolbarCustomContent,
   onRowClick,
   noDataMessage = "No data available",
}: DataTableProps<TData, TValue>) {
   const [sorting, setSorting] = useState<SortingState>([])
   const [globalFilter, setGlobalFilter] = useState("")
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = useState({})
   const [selectedRow, setSelectedRow] = useState<TData | null>(null)
   const [isModalOpen, setIsModalOpen] = useState(false)

   // Debounced global filter
   const debouncedSetGlobalFilter = useCallback(
      (value: string) => {
         const timeoutId = setTimeout(() => {
            setGlobalFilter(value)
         }, 300)
         return () => clearTimeout(timeoutId)
      },
      []
   )

   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      enableRowSelection,
      enableColumnFilters,
      enableSorting,
      state: {
         sorting,
         globalFilter,
         columnFilters,
         columnVisibility,
         rowSelection,
      },
      initialState: {
         pagination: {
            pageSize,
         },
      },
   })

   // Export functions with error handling
   const handleExport = async (type: 'excel' | 'csv' | 'pdf') => {
      try {
         const exportData = table.getFilteredRowModel().rows.map(row => row.original)

         switch (type) {
            case 'excel':
               const ws = XLSX.utils.json_to_sheet(exportData)
               const wb = XLSX.utils.book_new()
               XLSX.utils.book_append_sheet(wb, ws, "Data")
               XLSX.writeFile(wb, `export-${new Date().toISOString()}.xlsx`)
               break

            case 'csv':
               const csvWs = XLSX.utils.json_to_sheet(exportData)
               const csv = XLSX.utils.sheet_to_csv(csvWs)
               const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
               const url = URL.createObjectURL(blob)
               const link = document.createElement('a')
               link.href = url
               link.download = `export-${new Date().toISOString()}.csv`
               document.body.appendChild(link)
               link.click()
               document.body.removeChild(link)
               URL.revokeObjectURL(url)
               break

            case 'pdf':
               const doc = new jsPDF()
               autoTable(doc, {
                  head: [columns.map(col => (col.header as string))],
                  body: exportData.map(row =>
                     columns.map(col => String((row as any)[(col as any).accessorKey]))
                  ),
                  styles: { overflow: 'linebreak' },
                  headStyles: { fillColor: [41, 128, 185] },
               })
               doc.save(`export-${new Date().toISOString()}.pdf`)
               break
         }
      } catch (error) {
         console.error(`Error exporting ${type}:`, error)
         // Here you could add a toast notification for error handling
      }
   }

   const handleRowClick = (row: TData) => {
      if (onRowClick) {
         onRowClick(row)
      } else {
         setSelectedRow(row)
         setIsModalOpen(true)
      }
   }

   const renderSkeletonRows = () => (
      Array.from({ length: pageSize }).map((_, rowIndex) => (
         <TableRow key={`skeleton-row-${rowIndex}`}>
            {columns.map((_, colIndex) => (
               <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                  <Skeleton className="h-4 w-full" />
               </TableCell>
            ))}
            <TableCell>
               <Skeleton className="h-8 w-20" />
            </TableCell>
         </TableRow>
      ))
   )

   return (
      <div className="space-y-4">
         {/* Header Section */}
         {(title || description) && (
            <div className="space-y-1">
               {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
               {description && <p className="text-muted-foreground">{description}</p>}
            </div>
         )}

         {/* Toolbar Section */}
         <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
               {/* Search and Filters */}
               <div className="flex flex-wrap items-center gap-2">
                  {enableGlobalFilter && (
                     <div className="flex items-center gap-2">
                        <div className="relative">
                           <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                           <Input
                              placeholder="Search all columns..."
                              onChange={(e) => debouncedSetGlobalFilter(e.target.value)}
                              className="pl-8 md:w-64"
                           />
                        </div>
                        <p className="text-sm text-muted-foreground">
                           {table.getFilteredRowModel().rows.length} results
                        </p>
                     </div>
                  )}

                  {enableColumnFilters && (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="outline" size="sm">
                              <Filter className="mr-2 h-4 w-4" />
                              Filters
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                           <DropdownMenuLabel>Column Filters</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           {table.getAllColumns()
                              .filter(column => column.getCanFilter())
                              .map(column => (
                                 <div key={column.id} className="p-2">
                                    <Input
                                       placeholder={`Filter ${column.id}...`}
                                       value={(column.getFilterValue() as string) ?? ""}
                                       onChange={(e) =>
                                          column.setFilterValue(e.target.value)
                                       }
                                       className="w-full"
                                    />
                                 </div>
                              ))}
                        </DropdownMenuContent>
                     </DropdownMenu>
                  )}
               </div>

               {/* Actions */}
               <div className="flex flex-wrap items-center gap-2">
                  {toolbarCustomContent}

                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                           <Settings className="mr-2 h-4 w-4" />
                           View
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table.getAllColumns()
                           .filter(column => column.getCanHide())
                           .map(column => (
                              <DropdownMenuCheckboxItem
                                 key={column.id}
                                 checked={column.getIsVisible()}
                                 onCheckedChange={(checked) => column.toggleVisibility(checked)}
                              >
                                 {column.id}
                              </DropdownMenuCheckboxItem>
                           ))}
                     </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                           <Download className="mr-2 h-4 w-4" />
                           Export
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <TooltipProvider>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <DropdownMenuItem onClick={() => handleExport('excel')}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Excel
                                 </DropdownMenuItem>
                              </TooltipTrigger>
                              <TooltipContent>Export as Excel file</TooltipContent>
                           </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <DropdownMenuItem onClick={() => handleExport('csv')}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    CSV
                                 </DropdownMenuItem>
                              </TooltipTrigger>
                              <TooltipContent>Export as CSV file</TooltipContent>
                           </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    PDF
                                 </DropdownMenuItem>
                              </TooltipTrigger>
                              <TooltipContent>Export as PDF file</TooltipContent>
                           </Tooltip>
                        </TooltipProvider>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  {onAdd && (
                     <Button onClick={onAdd} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                     </Button>
                  )}
               </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                           {headerGroup.headers.map((header) => (
                              <TableHead
                                 key={header.id}
                                 className={cn(
                                    header.column.getCanSort() && "cursor-pointer select-none",
                                    "relative"
                                 )}
                                 onClick={header.column.getToggleSortingHandler()}
                              >
                                 <div className="flex items-center gap-2">
                                    {flexRender(
                                       header.column.columnDef.header,
                                       header.getContext()
                                    )}
                                    {header.column.getCanSort() && (
                                       <div className="flex flex-col">
                                          <ChevronUp className={cn(
                                             "h-3 w-3",
                                             header.column.getIsSorted() === "asc"
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                          )} />
                                          <ChevronDown className={cn(
                                             "h-3 w-3 -mt-1",
                                             header.column.getIsSorted() === "desc"
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                          )} />
                                       </div>
                                    )}
                                 </div>
                              </TableHead>
                           ))}
                           <TableHead>Actions</TableHead>
                        </TableRow>
                     ))}
                  </TableHeader>
                  <TableBody>
                     {loading ? (
                        renderSkeletonRows()
                     ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                           <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              className={cn(
                                 "group",
                                 onRowClick && "cursor-pointer hover:bg-muted/50"
                              )}
                              onClick={() => handleRowClick(row.original)}
                           >
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell key={cell.id}>
                                    {flexRender(
                                       cell.column.columnDef.cell,
                                       cell.getContext()
                                    )}
                                 </TableCell>
                              ))}
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                 <div className="flex justify-end">
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             className="opacity-0 group-hover:opacity-100"
                                          >
                                             <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent align="end">
                                          {onView && (
                                             <DropdownMenuItem onClick={() => onView(row.original)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                             </DropdownMenuItem>
                                          )}
                                          {onEdit && (
                                             <DropdownMenuItem onClick={() => onEdit(row.original)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                             </DropdownMenuItem>
                                          )}
                                          {onDelete && (
                                             <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                   onClick={() => onDelete(row.original)}
                                                   className="text-destructive focus:text-destructive"
                                                >
                                                   <Trash2 className="mr-2 h-4 w-4" />
                                                   Delete
                                                </DropdownMenuItem>
                                             </>
                                          )}
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell
                              colSpan={columns.length + 1}
                              className="h-24 text-center"
                           >
                              <div className="flex flex-col items-center justify-center gap-2">
                                 <Frown className="h-8 w-8 text-muted-foreground" />
                                 <p className="text-lg font-medium text-muted-foreground">
                                    {noDataMessage}
                                 </p>
                              </div>
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </div>

            {/* Pagination */}
            {enablePagination && (
               <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex items-center gap-2">
                     <p className="text-sm text-muted-foreground">
                        Showing {table.getRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} results
                     </p>
                     <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                     >
                        <SelectTrigger className="h-8 w-24">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {itemsPerPageOptions.map((size) => (
                              <SelectItem key={size} value={size.toString()}>
                                 {size} per page
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                     >
                        First
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                     >
                        Previous
                     </Button>
                     <span className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                     </span>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                     >
                        Next
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                     >
                        Last
                     </Button>
                  </div>
               </div>
            )}
         </div>

         {/* Details Modal */}
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl">
               <DialogHeader>
                  <DialogTitle>Details</DialogTitle>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  {selectedRow && (
                     <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedRow)
                           .filter(([key]) => key !== "id") // Exclure la clé "id"
                           .map(([key, value]) => (
                              <div key={key} className="space-y-1">
                                 <p className="text-sm capitalize font-medium text-muted-foreground">
                                    {key}
                                 </p>
                                 <p className="text-sm">
                                    {value === null ? "—" : String(value)}
                                 </p>
                              </div>
                           ))}
                     </div>
                  )}
               </div>
               <DialogFooter>
                  {onView && (
                     <Button variant="outline" onClick={() => onView(selectedRow as TData)}>
                        View
                     </Button>
                  )}
                  {onEdit && (
                     <Button variant="outline" onClick={() => onEdit(selectedRow as TData)}>
                        Edit
                     </Button>
                  )}
                  {onDelete && (
                     <Button
                        variant="destructive"
                        onClick={() => onDelete(selectedRow as TData)}
                     >
                        Delete
                     </Button>
                  )}
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   )
}