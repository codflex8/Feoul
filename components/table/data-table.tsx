"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { arSA } from "date-fns/locale/ar-SA";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa6";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cityOptions, statusOptions } from "@/constants";
import { Project } from "@/types/dashboard.types";
import UpdatePopup from "../form/UpdatePopup";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page?: string;
  deleteRow?: (id: string) => void;
  updateRow?: (rowData: TData) => void;
  updateFields?: { key: keyof TData; label: string }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  deleteRow,
  updateRow,
  updateFields,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedRow, setSelectedRow] = useState<TData | null>(null);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [date, setDate] = useState<Date | string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const handleCityOption = (value: string) => {
    setSelectedCity(value);
    table.getColumn("city")?.setFilterValue(value);
  };

  const handleStatusOption = (value: string) => {
    setSelectedStatus(value);
    table.getColumn("status")?.setFilterValue(value);
  };

  const handleDateFilter = (value: Date | string | undefined) => {
    if (value === undefined) {
      setDate("");
      table.getColumn("date")?.setFilterValue("");
    } else {
      setDate(value);
      if (value instanceof Date) {
        const normalizedDate = new Date(
          value.getFullYear(),
          value.getMonth(),
          value.getDate()
        );
        const selectedDateTimestamp = normalizedDate.getTime();
        console.log(
          "Selected Date Normalized Timestamp:",
          selectedDateTimestamp
        );
        table.getColumn("date")?.setFilterValue(selectedDateTimestamp);
      } else {
        table.getColumn("date")?.setFilterValue("");
      }
    }
  };

  const clearAll = () => {
    setSelectedCity("");
    setSelectedStatus("");
    setDate("");
    table.resetColumnFilters();
  };

  const handleUpdate = (updatedData: TData) => {
    if (updateRow) {
      updateRow(updatedData);
    }
    setIsUpdatePopupOpen(false);
  };

  return (
    <div className="flex-1">
      {/* Projects Filter Section */}
      {page === "projects" && (
        <div className="my-4 flex items-center justify-start gap-8">
          {/* Cities Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[150px] flex items-center justify-between"
              >
                <span>
                  {cityOptions.find((option) => option.label === selectedCity)
                    ?.label || "المدينة"}
                </span>
                <FaChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuRadioGroup
                value={selectedCity}
                onValueChange={setSelectedCity}
              >
                {cityOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.id}
                    value={option.label}
                    onSelect={() => handleCityOption(option.label)}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[150px] flex items-center justify-between"
              >
                <span>
                  {statusOptions.find(
                    (option) => option.label === selectedStatus
                  )?.label || "حالة المشروع"}
                </span>
                <FaChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuRadioGroup
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                {statusOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.id}
                    value={option.label}
                    onSelect={() => handleStatusOption(option.label)}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* DatePicker Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date ? (
                  format(date, "PPP", { locale: arSA })
                ) : (
                  <span className="text-black">تاريخ الإضافة</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={new Date(date)}
                onSelect={(value) => handleDateFilter(value)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={() => clearAll()}
            className="bg-slate-500 hover:bg-slate-600 text-white"
          >
            إعادة ضبط
          </Button>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table className="bg-white min-w-full">
          <TableHeader className="bg-zinc-500 !hover:bg-zinc-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white ">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  لا يوجد نتائج
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>




            
      {/* {!page && (
        <div className="flex items-center justify-strat !space-x-4 py-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            السابق
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            التالي
          </Button>
        </div>
      )} */}

      {/* Update Popup */}
      {isUpdatePopupOpen && selectedRow && updateFields && (
        <UpdatePopup
          rowData={selectedRow}
          onUpdate={handleUpdate}
          onClose={() => setIsUpdatePopupOpen(false)}
          fields={updateFields}
        />
      )}
    </div>
  );
}
