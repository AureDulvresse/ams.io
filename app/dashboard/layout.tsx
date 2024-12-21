import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/layouts/sidebar/app-sidebar";
import TopBar from "@/src/components/layouts/topbar/top-bar";
import { auth } from "@/src/lib/auth";

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {

   const session = await auth();
   const user = session?.user;

   return <>
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
            <TopBar />
            {children}
         </SidebarInset>
      </SidebarProvider>
   </>
}