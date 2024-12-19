import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { Toaster } from "@/src/components/ui/sonner";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/layouts/sidebar/app-sidebar";

const fredoka = localFont({
  src: "./fonts/Fredoka-VariableFont_wdth,wght.ttf",
  variable: "--font-fredoka",
  weight: "100 900",
});
const inter = localFont({
  src: "./fonts/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Academia Management Sync",
  description: "SaaS Gestion Scolaire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${fredoka.variable} ${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              {children}
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
