import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/layouts/sidebar/app-sidebar";

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return <section>
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
            {children}
         </SidebarInset>
      </SidebarProvider>
   </section>
}