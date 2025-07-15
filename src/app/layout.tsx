import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { ThemeBody } from "@/components/theme-body";
import { CommandMenu } from "@/components/command-menu";
import { AuthGuard } from "@/components/auth-guard";
import { LayoutWrapper } from "@/components/layout-wrapper";

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
          <ThemeBody>
            <AuthGuard>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
              <Toaster 
                position="top-right"
                richColors
                closeButton
                theme="system"
              />
              <CommandMenu />
            </AuthGuard>
          </ThemeBody>
        </Providers>
      </body>
    </html>
  );
}