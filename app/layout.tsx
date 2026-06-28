import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import QueryProvider from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gratech - Multi Service Platform",
  description: "Your trusted multi-service platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Toaster position="top-center" richColors />
        <Navbar />
        <main className="pt-2 md:pt-0 min-h-screen">
          {children}
        </main>
        </QueryProvider>
      </body>
    </html>
  );
}