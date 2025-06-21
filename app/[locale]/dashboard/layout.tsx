import DashboardHeader from "@/components/dashboard/DashboardHeader"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-full w-screen overflow-x-hidden" dir="rtl">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative">
          <DashboardHeader />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
