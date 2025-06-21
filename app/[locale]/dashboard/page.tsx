import React from 'react';
import { getHome } from "@/lib/actions/dashboard.actions";
import DashboardPageClient from './DashboradPageClient';
import { interestsData, projectsData, unitData } from '@/dummyData'

export default async function DashboardPage() {

  const home = await getHome();

  return <DashboardPageClient home={home}  />;
}