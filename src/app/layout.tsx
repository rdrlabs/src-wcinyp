import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "@/components/providers";
import { ThemeToggle } from "@/components/theme-toggle";
import { RootProvider } from 'fumadocs-ui/provider';

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
        <RootProvider>
          <Providers>
            <div className="min-h-screen bg-background">
              <nav className="border-b">
              <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center space-x-8">
                    <Link href="/" className="text-xl font-bold">
                      WCINYP
                    </Link>
                    <div className="hidden md:flex space-x-6">
                      <Link href="/documents" className="text-sm font-medium hover:text-primary">
                        Documents
                      </Link>
                      <Link href="/providers" className="text-sm font-medium hover:text-primary">
                        Providers
                      </Link>
                      <Link href="/forms" className="text-sm font-medium hover:text-primary">
                        Form Generator
                      </Link>
                      <Link href="/directory" className="text-sm font-medium hover:text-primary">
                        Directory
                      </Link>
                      <Link href="/knowledge" className="text-sm font-medium hover:text-primary">
                        Knowledge Base
                      </Link>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
            <main>{children}</main>
          </div>
        </Providers>
        </RootProvider>
      </body>
    </html>
  );
}