import { issuesColumns } from '@/components/table/columns';
import { DataTable } from '@/components/table/data-table';
import { getIssues } from '@/lib/actions/dashboard.actions';

const page = async () => {
  const issues = await getIssues();

   const issuesWithIds = issues.map((issue: any, index: number) => ({
    ...issue,
    rowId: index + 1,  
  }));

  console.log("🚀 ~ page ~ issuesWithIds:", issuesWithIds);

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
       <DataTable columns={issuesColumns} data={issuesWithIds || []} />
    </div>
  );
};

export default page;

