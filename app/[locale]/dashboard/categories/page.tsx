import { getCategories, getProjects } from "@/lib/actions/dashboard.actions";
import CategoriesPageClient from "./CategoriesPageClient";

export default async function DashboardPage() {
  const categories = await getCategories();

  return <CategoriesPageClient categories={categories.items || []} />;
}
