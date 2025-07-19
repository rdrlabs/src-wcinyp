import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";
import { ThemeBody } from "@/components/theme-body";
import { CommandMenu } from "@/components/command-menu";
import { ErrorBoundary } from "@/components/error-boundary";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Apply saved theme to prevent FOUC
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark')
                } else if (localStorage.theme === 'light') {
                  document.documentElement.setAttribute('data-theme', 'light')
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary level="page" showDetails={process.env.NODE_ENV === 'development'}>
            <ThemeBody>
              <div className="min-h-screen bg-background flex flex-col">
                <NavBar />
                <main className="flex-1">
                  <ErrorBoundary level="section">
                    {children}
                  </ErrorBoundary>
                </main>
                <Footer />
              </div>
              <Toaster 
                position="top-right"
                richColors
                closeButton
                theme="system"
              />
              <CommandMenu />
            </ThemeBody>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}