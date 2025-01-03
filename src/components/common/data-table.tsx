"use client"
import { useState } from "react"
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
   Frown
} from "lucide-react"
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[]
   data: TData[]
   onView?: (row: TData) => void
   onEdit?: (row: TData) => void
   onDelete?: (row: TData) => void
   onAdd?: () => void
   pageSize?: number
}

export function DataTable<TData, TValue>({
   columns,
   data,
   onView,
   onEdit,
   onDelete,
   onAdd,
   pageSize = 10,
}: DataTableProps<TData, TValue>) {
   const [sorting, setSorting] = useState<SortingState>([])
   const [globalFilter, setGlobalFilter] = useState("")
   const [selectedRow, setSelectedRow] = useState<TData | null>(null)
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = useState({})
   const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

   // Global filter function
   const globalFilterFn = (row: any) => {
      return Object.values(row).some((value) =>
         String(value).toLowerCase().includes(globalFilter.toLowerCase())
      )
   }

   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onSortingChange: setSorting,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
         sorting,
         globalFilter,
         columnVisibility,
         rowSelection,
      },
      initialState: {
         pagination: {
            pageSize,
         },
      },
      filterFns: {
         global: globalFilterFn,
      },
   })

   // Export functions
   const exportToExcel = () => {
      const exportData = table.getFilteredRowModel().rows.map(row => row.original)
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Data")
      XLSX.writeFile(wb, "export.xlsx")
   }

   const exportToCSV = () => {
      const exportData = table.getFilteredRowModel().rows.map(row => row.original)
      const ws = XLSX.utils.json_to_sheet(exportData)
      const csv = XLSX.utils.sheet_to_csv(ws)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = "export.csv"
      link.click()
   }

   const exportToPDF = () => {
      const doc = new jsPDF()
      const exportData = table.getFilteredRowModel().rows.map(row => row.original)
      autoTable(doc, {
         head: [columns.map(col => (col.header as string))],
         body: exportData.map(row =>
            columns.map(col => (row as any)[(col as any).accessorKey])
         ),
      })
      doc.save('export.pdf')
   }

   const toggleRowExpansion = (rowId: string) => {
      setExpandedRows(prev => ({
         ...prev,
         [rowId]: !prev[rowId]
      }))
   }

   const handleRowClick = (row: TData) => {
      setSelectedRow(row)
      setIsModalOpen(true)
   }

   return (
      <div className="space-y-4">
         <div className="flex flex-col gap-4">
            {/* Search and Actions Bar */}
            <div className="flex flex-col items-center md:justify-between md:flex-row gap-2">
               <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="relative w-full">
                     <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                     <Input
                        placeholder="Search all columns..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-8 pr-4"
                     />
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                     {table.getFilteredRowModel().rows.length} results
                  </span>
               </div>

               <div className="flex items-center gap-2">
                  {/* Column Visibility Dropdown */}
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                           <Settings className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                        {table.getAllColumns().map((column) => {
                           if (!column.getCanHide()) return null
                           return (
                              <DropdownMenuCheckboxItem
                                 key={column.id}
                                 checked={column.getIsVisible()}
                                 onCheckedChange={(checked) => column.toggleVisibility(checked)}
                              >
                                 {column.id}
                              </DropdownMenuCheckboxItem>
                           )
                        })}
                     </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Export Dropdown */}
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                           <Download className="mr-2 h-4 w-4" />
                           Export
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                        <DropdownMenuItem onClick={exportToExcel}>
                           <FileDown className="mr-2 h-4 w-4" />
                           Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportToCSV}>
                           <FileDown className="mr-2 h-4 w-4" />
                           CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportToPDF}>
                           <FileDown className="mr-2 h-4 w-4" />
                           PDF
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  {onAdd && (
                     <Button onClick={onAdd} className="bg-primary hover:bg-primary">
                        <Plus className="md:mr-2 h-4 w-4" />
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
                                 onClick={header.column.getToggleSortingHandler()}
                                 className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                              >
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                       header.column.columnDef.header,
                                       header.getContext()
                                    )}
                              </TableHead>
                           ))}
                           <TableHead>Actions</TableHead>
                        </TableRow>
                     ))}
                  </TableHeader>
                  <TableBody>
                     {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                           <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleRowClick(row.original)}
                           >
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                 </TableCell>
                              ))}
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                       {onView && (
                                          <DropdownMenuItem onClick={() => onView(row.original)}>
                                             <Eye className="mr-2 h-4 w-4" />
                                             View
                                          </DropdownMenuItem>
                                       )}
                                       {onEdit && (
                                          <DropdownMenuItem onClick={() => onEdit(row.original)}>
                                             Edit
                                          </DropdownMenuItem>
                                       )}
                                       {onDelete && (
                                          <DropdownMenuItem
                                             onClick={() => onDelete(row.original)}
                                             className="text-red-600"
                                          >
                                             Delete
                                          </DropdownMenuItem>
                                       )}
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell
                              colSpan={columns.length + 1}
                              className="h-24 text-center"
                           >
                              <Frown className="w-12 h-12 text-muted-foreground" />
                              <p className="text-lg text-muted-foreground">Aucune donnée à afficher</p>
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
               <div className="text-sm text-gray-500">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
               </div>
               <div className="flex items-center space-x-2">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => table.previousPage()}
                     disabled={!table.getCanPreviousPage()}
                  >
                     Previous
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => table.nextPage()}
                     disabled={!table.getCanNextPage()}
                  >
                     Next
                  </Button>
               </div>
            </div>
         </div>

         {/* Details Modal */}
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Details</DialogTitle>
               </DialogHeader>
               <div className="py-4">
                  {selectedRow && (
                     <div className="space-y-2">
                        {Object.entries(selectedRow).map(([key, value]) => (
                           <div key={key} className="grid grid-cols-2 gap-2">
                              <div className="font-medium">{key}:</div>
                              <div>{String(value)}</div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
               <DialogFooter className="flex justify-end gap-2">
                  {onView && (
                     <Button onClick={() => onView(selectedRow as TData)}>
                        View
                     </Button>
                  )}
                  {onEdit && (
                     <Button onClick={() => onEdit(selectedRow as TData)}>
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