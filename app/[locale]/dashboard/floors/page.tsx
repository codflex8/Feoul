"use client";
import { useEffect, useState } from "react";
import { floorsColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { getFloors } from "@/lib/actions/dashboard.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = () => {
  const [floors, setFloors] = useState<{ items: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const fetchedFloors = await getFloors();
        setFloors(fetchedFloors);
      } catch (error) {
        console.error("Failed to fetch floors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFloors();
  }, []);

  const paginatedData =
    floors?.items.slice(
      currentPage * rowsPerPage,
      (currentPage + 1) * rowsPerPage
    ) || [];

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          الطوابق السكنية
        </h1>
        <Link href={`/ar/dashboard/floors/add`}>
          <button className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-1 px-3 rounded">
            إضافة طابق
          </button>
        </Link>
      </div>
      <DataTable columns={floorsColumns} data={paginatedData || []} />

      <div className="flex items-center justify-start !space-x-4 py-4">
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
          disabled={(currentPage + 1) * rowsPerPage >= floors?.length}
        >
          التالي
        </Button>
      </div>
    </div>
  );
};

export default page;
