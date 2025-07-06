import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const features = [
    {
      title: "Knowledge Base",
      description: "Technical documentation, user guides, and best practices for staff reference and training materials",
      href: "/knowledge",
    },
    {
      title: "Document Hub",
      description: "Centralized repository for patient forms, medical documents, and administrative paperwork with version control",
      href: "/documents",
    },
    {
      title: "Updates",
      description: "Latest news, operational updates, departmental communications, and important announcements from leadership",
      href: "/updates",
    },
    {
      title: "Directory",
      description: "Complete contact database for internal staff, external partners, facilities, vendors, and referring providers",
      href: "/directory",
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
      
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="no-underline">
            <Card className="h-full transition-colors hover:bg-accent hover:shadow-md">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}