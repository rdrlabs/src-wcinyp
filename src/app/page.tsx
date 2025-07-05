import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const features = [
    {
      title: "Document Hub",
      description: "Manage patient forms and medical documents",
      href: "/documents",
      stats: "156 documents",
    },
    {
      title: "Provider Directory", 
      description: "Search and manage medical staff information",
      href: "/providers",
      stats: "42 providers",
    },
    {
      title: "Directory",
      description: "Comprehensive contact database",
      href: "/directory",
      stats: "150+ contacts",
    },
    {
      title: "Knowledge Base",
      description: "Documentation and guides",
      href: "/knowledge",
      stats: "15+ articles",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">WCINYP Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Weill Cornell Imaging at NewYork-Presbyterian
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="no-underline">
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{feature.stats}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}