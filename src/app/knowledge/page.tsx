import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function KnowledgePage() {
  const categories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using WCINYP",
      articles: [
        { title: "Introduction to WCINYP", href: "/docs/intro" },
        { title: "Quick Start Guide", href: "/docs/quickstart" },
        { title: "System Requirements", href: "/docs/requirements" },
      ]
    },
    {
      title: "Document Management",
      description: "How to work with documents and forms",
      articles: [
        { title: "Managing ABN Forms", href: "/docs/abn-forms" },
        { title: "Patient Questionnaires", href: "/docs/questionnaires" },
        { title: "Invoice Processing", href: "/docs/invoices" },
      ]
    },
    {
      title: "Provider Management",
      description: "Managing provider information and directories",
      articles: [
        { title: "Adding New Providers", href: "/docs/add-providers" },
        { title: "Provider Database", href: "/docs/provider-db" },
        { title: "Contact Management", href: "/docs/contacts" },
      ]
    },
    {
      title: "Form Generator",
      description: "Creating and automating forms",
      articles: [
        { title: "Self-Pay Form Automation", href: "/docs/self-pay" },
        { title: "Creating Custom Forms", href: "/docs/custom-forms" },
        { title: "Form Templates", href: "/docs/templates" },
      ]
    },
    {
      title: "Integrations",
      description: "Connecting with external systems",
      articles: [
        { title: "Insurance Integration", href: "/docs/insurance" },
        { title: "Lab System Integration", href: "/docs/lab-systems" },
        { title: "EMR/EHR Connectivity", href: "/docs/emr" },
      ]
    },
    {
      title: "Best Practices",
      description: "Guidelines and recommendations",
      articles: [
        { title: "HIPAA Compliance", href: "/docs/hipaa" },
        { title: "Data Security", href: "/docs/security" },
        { title: "Workflow Optimization", href: "/docs/workflows" },
      ]
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground mt-2">
          Documentation, guides, and best practices for WCINYP
        </p>
      </div>
      
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search documentation..."
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, idx) => (
          <Card key={idx} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.articles.map((article, articleIdx) => (
                  <li key={articleIdx}>
                    <Link 
                      href={article.href}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-base">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <Button size="sm" variant="outline">Contact Support</Button>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-base">Video Tutorials</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Learn with step-by-step video guides
            </p>
            <Button size="sm" variant="outline">Watch Videos</Button>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-base">API Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Developer guides and API reference
            </p>
            <Button size="sm" variant="outline">View API Docs</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}