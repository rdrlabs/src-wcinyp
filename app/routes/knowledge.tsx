import { Button } from "~/components/ui/button";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export function meta() {
  return [
    { title: "Knowledge Base - WCINYP" },
    { name: "description", content: "Documentation and guides for WCINYP system" },
  ];
}

export default function KnowledgeRoute() {
  const categories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using WCINYP",
      articles: [
        { title: "Introduction to WCINYP", href: "/knowledge/intro" },
        { title: "Quick Start Guide", href: "/knowledge/quickstart" },
        { title: "System Requirements", href: "/knowledge/requirements" },
      ]
    },
    {
      title: "Document Management",
      description: "How to work with documents and forms",
      articles: [
        { title: "Managing ABN Forms", href: "/knowledge/abn-forms" },
        { title: "Patient Questionnaires", href: "/knowledge/questionnaires" },
        { title: "Invoice Processing", href: "/knowledge/invoices" },
      ]
    },
    {
      title: "Provider Management",
      description: "Managing provider information and directories",
      articles: [
        { title: "Adding New Providers", href: "/knowledge/add-providers" },
        { title: "Provider Database", href: "/knowledge/provider-db" },
        { title: "Contact Management", href: "/knowledge/contacts" },
      ]
    },
    {
      title: "Form Generator",
      description: "Creating and automating forms",
      articles: [
        { title: "Self-Pay Form Automation", href: "/knowledge/self-pay" },
        { title: "Creating Custom Forms", href: "/knowledge/custom-forms" },
        { title: "Form Templates", href: "/knowledge/templates" },
      ]
    },
    {
      title: "Integrations",
      description: "Connecting with external systems",
      articles: [
        { title: "Insurance Integration", href: "/knowledge/insurance" },
        { title: "Lab System Integration", href: "/knowledge/lab-systems" },
        { title: "EMR/EHR Connectivity", href: "/knowledge/emr" },
      ]
    },
    {
      title: "Best Practices",
      description: "Guidelines and recommendations",
      articles: [
        { title: "HIPAA Compliance", href: "/knowledge/hipaa" },
        { title: "Data Security", href: "/knowledge/security" },
        { title: "Workflow Optimization", href: "/knowledge/workflows" },
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
                      to={article.href}
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
              Can't find what you're looking for?
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

export { ErrorBoundary };