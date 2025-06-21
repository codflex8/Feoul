// app/projects/[projectId]/page.tsx (Server Component)
import React from "react";
import { getCategories, getProjectById } from "@/lib/actions/map.actions";
import BuildingPageClient from "./BuildingPageClient"; // Your Client Component
import { notFound } from "next/navigation";

export default async function BuildingPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;
  const project = await getProjectById(projectId);
  const { items } = await getCategories();

  if (!project?.project) {
    // TODO: FIX the root layout issue and not-found page is not working!
    notFound();
  }

  // TODO: categories should be passed down as object to render the info but it's not working as expected
  // TODO: So I'll not make any changes to the code logic for ui filtering for now, I just passed it as an array of strings as it was before with static data
  const categories = items.map((item) => item.name);

  return (
    <BuildingPageClient
      project={project.project}
      unitsData={project.unitsData}
      categories={categories}
    />
  );
}
