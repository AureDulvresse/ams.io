"use client";
import * as React from "react";
import * as xlsx from "xlsx";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Eye,
  FileUp,
  Frown,
  Pencil,
  Trash2,
  FileDown,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import exportToExcel from "@/lib/exportToExcel";
import exportToPDF from "@/lib/exportToPDF";
import Modal from "./Modal";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filters: string[];
  showSelection?: boolean;
  moduleName: string;
  isLoading?: boolean; // Nouveau paramètre isLoading
}

const DataTable = <T,>({
  data,
  columns,
  filters,
  showSelection = false,
  moduleName,
  isLoading = false, // Valeur par défaut false
}: DataTableProps<T>) => {
  const navigate = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [importedData, setImportedData] = React.useState<T[]>([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [importError, setImportError] = React.useState<string | null>(null); // État pour les erreurs d'importation

  // Merge des données actuelles et importées
  const mergedData = React.useMemo(() => {
    return [...data, ...importedData];
  }, [data, importedData]);

  const filteredData = React.useMemo(() => {
    if (!globalFilter) return mergedData;

    return mergedData.filter((row) =>
      filters.some((filter) => {
        const cellValue = (row as any)[filter];
        return String(cellValue)
          .toLowerCase()
          .includes(globalFilter.toLowerCase());
      })
    );
  }, [mergedData, filters, globalFilter]);

  const columnsWithExtras = React.useMemo(() => {
    const extraColumns: ColumnDef<T>[] = [
      ...(showSelection
        ? [
            {
              id: "select",
              header: ({ table }: { table: any }) => (
                <Checkbox
                  className="mx-4"
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                  }
                  aria-label="Sélectionner tout"
                />
              ),
              cell: ({ row }: { row: any }) => (
                <Checkbox
                  className="mx-4"
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Sélectionner la ligne"
                />
              ),
              enableSorting: false,
              enableHiding: false,
            },
          ]
        : []),
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: any }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-center">
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() =>
                  navigate.push(`${moduleName}/${row.original.id}`)
                }
              >
                <Eye size={16} />
                <span>Détail</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() =>
                  navigate.push(`${moduleName}/${row.original.id}/edit`)
                }
              >
                <Pencil size={16} />
                <span>Modifier</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-500 focus:bg-red-500 focus:text-white"
                onClick={() => alert(`Supprimer la ligne : ${row.original}`)}
              >
                <Trash2 size={16} />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ];

    return extraColumns;
  }, [columns, showSelection]);

  const table = useReactTable({
    data: filteredData,
    columns: columnsWithExtras,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  // Création d'un skeleton pour chaque cellule
  const skeletonRows = Array.from({ length: 5 }).map((_, rowIndex) => (
    <TableRow key={`skeleton-row-${rowIndex}`}>
      {columnsWithExtras.map((column, colIndex) => (
        <TableCell key={`skeleton-cell-${colIndex}`}>
          <Skeleton className="h-4 bg-gray-300 rounded dark:bg-gray-700 animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  ));

  const toggleImportDialogue = () => {
    setIsImportDialogOpen(!isImportDialogOpen);
    setImportError(null); // Réinitialiser l'erreur lors de l'ouverture de la modal
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = xlsx.read(data, { type: "array" });

        // Supposons que la première feuille est celle que nous voulons importer
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const importedData = xlsx.utils.sheet_to_json(firstSheet);

        // Filtrer les colonnes en fonction des colonnes de votre table
        const filteredData = importedData.map((row) => {
          const filteredRow: Record<string, any> = {};
          columns.forEach((column) => {
          
              if (column.id !== "actions" && column.id !== "select") {
                filteredRow[typeof column.id != "undefined" ? column.id : ""] = row??[column.id];
              }
            
           
          });
          return filteredRow;
        });

        // Mettez à jour l'état des données importées
        setImportedData((prev) => [...prev, ...filteredData]);

        // Fermer la modal
        setIsImportDialogOpen(false);
        setFile(null);
      } catch (error) {
        setImportError(
          "Erreur lors de l'importation des données. Vérifiez le format du fichier."
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportToPDF = () => {
    const exportColumns = columnsWithExtras
      .filter((column) => column.id !== "actions" && column.id !== "select")
      .map((column) => column.header as string);

    const dataToExport = table.getRowModel().rows.map((row) => {
      const rowData: Record<string, any> = {};

      row.getVisibleCells().forEach((cell) => {
        const columnId = cell.column.id;
        if (columnId !== "actions" && columnId !== "select") {
          const cellValue = cell.getValue();
          rowData[columnId] =
            typeof cellValue === "object" && cellValue !== null
              ? cellValue.name || cellValue.id || cellValue // ajustez ici selon vos besoins
              : cellValue;
        }
      });

      return rowData;
    });

    console.log(dataToExport);
    exportToPDF(exportColumns, dataToExport, moduleName);
  };

  const handleExportToExcel = () => {
    exportToExcel(data, moduleName);
  };

  // Fonction pour télécharger le modèle Excel
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        id: "",
        name: "",
        // Ajoutez d'autres colonnes vides selon vos besoins
      },
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Template");

    // Télécharger le fichier
    xlsx.writeFile(workbook, `${moduleName}_template.xlsx`);
  };

  const handleRemoveSelected = () => {
    alert("Remove");
  };

  return (
    <>
      <Card className="p-4 bg-white dark:bg-gray-900 rounded-lg w-full">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Recherche..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-80 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-100 dark:bg-gray-800"
          />
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Actions <DotsHorizontalIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={toggleImportDialogue}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Importer
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleExportToPDF}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Exporter PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleExportToExcel}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Exporter Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleDownloadTemplate}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Télécharger Modèle
                </DropdownMenuItem>
                {showSelection && (
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-600 cursor-pointer"
                    onClick={handleRemoveSelected}
                  >
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Supprimer les selectionnés
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {isLoading ? (
          <Table>
            <TableBody>{skeletonRows}</TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columnsWithExtras.length}>
                    <div className="flex flex-col items-center jusify-center w-full py-2">
                      <h1 className="text-3xl text-gray-400 dark:text-gray-700">
                        <Frown size={35} />
                      </h1>
                      <span className="text-gray-400 dark:text-gray-700 text-fredoka">
                        Aucune donnée à affficher pour l'instant.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        {table.getRowModel().rows.length ? (
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {"<<"}
              </Button>
              <Button
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {"<"}
              </Button>
              <Button
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {">"}
              </Button>
              <Button
                variant="outline"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {">>"}
              </Button>
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong>{" "}
              sur <strong>{table.getPageCount()}</strong>{" "}
            </div>
          </div>
        ) : (
          ""
        )}
      </Card>
      {isImportDialogOpen && (
        <Modal
          isOpen={isImportDialogOpen}
          onClose={toggleImportDialogue}
          title="Importation de donnée"
          content={
            <div className="space-y-4">
              <Input
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
              <Button onClick={handleImport}>Importer</Button>
            </div>
          }
          footer={
            <p className="text-xs text-gray-400">
              Assurez-vous de remplir tous les champs.
            </p>
          }
        />
      )}
    </>
  );
};

export default DataTable;
