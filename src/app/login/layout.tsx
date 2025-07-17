import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in - WCINYP",
  description: "Sign in to Weill Cornell Imaging at NewYork-Presbyterian",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      {children}
    </div>
  );
}