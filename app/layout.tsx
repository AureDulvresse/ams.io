import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/providers/theme-provider";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

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
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
