"use client";

import { useEffect, useState } from "react";
import { intrestsColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { getInterests } from "@/lib/actions/dashboard.actions";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [interests, setInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const fetchedInterests = await getInterests();
        setInterests(fetchedInterests);
      } catch (error) {
        console.error("Failed to fetch interests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  const paginatedData = interests.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex-1 p-6 flex items-center justify-center">
        <span className="text-xl font-semibold">جاري التحميل...</span>{" "}
        {/* Loading text */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      {/* Table Section */}
      <DataTable columns={intrestsColumns} data={paginatedData || []} />

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
          disabled={(currentPage + 1) * rowsPerPage >= interests.length}
        >
          التالي
        </Button>
      </div>
    </div>
  );
};

export default Page;
