import { getProjects } from "@/lib/actions/dashboard.actions";
 import ProjectsPageClient from './ProjectsPageClient';

export default async function DashboardPage() {

  const projects = await getProjects()

  console.log("Projects from Dashboard", projects);

  return <ProjectsPageClient projects={projects} />;
}