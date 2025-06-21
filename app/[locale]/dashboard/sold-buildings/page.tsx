"use client";

import { useEffect, useState } from "react";
import { unitsColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { getUnits } from "@/lib/actions/dashboard.actions";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10; // Number of rows per page

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const fetchedUnits = await getUnits();
        const saledUnits =
          fetchedUnits.items?.filter(
            (unit: { status: string }) => unit.status === "saled"
          ) || [];
        setUnits(saledUnits);
      } catch (error) {
        console.error("Failed to fetch units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  // Get current page data
  const paginatedData = units.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex-1 p-6 flex items-center justify-center">
        <span>جاري التحميل...</span> {/* Loading text */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      {/* Table Section */}
      <DataTable columns={unitsColumns} data={paginatedData} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-start space-x-4 py-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          السابق
        </Button>
        <span>الصفحة {currentPage + 1}</span>
        <Button
          variant="outline"
          size="lg"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={(currentPage + 1) * rowsPerPage >= units.length}
        >
          التالي
        </Button>
      </div>
    </div>
  );
};

export default Page;
