import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/layouts/sidebar/app-sidebar";
import TopBar from "@/src/components/layouts/topbar/top-bar";

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return <section>
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
            <TopBar />
            {children}
         </SidebarInset>
      </SidebarProvider>
   </section>
}