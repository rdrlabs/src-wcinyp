import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WCINYP",
  description: "Weill Cornell Imaging at NewYork-Presbyterian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background flex flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            richColors
            closeButton
            theme="system"
          />
        </Providers>
      </body>
    </html>
  );
}