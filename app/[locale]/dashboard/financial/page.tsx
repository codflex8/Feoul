import { financialColumns } from '@/components/table/columns';
import { DataTable } from '@/components/table/data-table';
import { financialData } from '@/dummyData';
import { getFinancial } from '@/lib/actions/dashboard.actions';

const page = async () => {
  const financial = await getFinancial()

  // console.log("interests from Dashboard", interests);

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      {/* Table Section */}
      <DataTable columns={financialColumns} data={financial.items} />
    </div>
  )
}

export default page

