import { useParams, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { Card, CardContent } from "~/components/ui/card";

export function meta() {
  return [
    { title: "Article - WCINYP Knowledge Base" },
    { name: "description", content: "WCINYP documentation article" },
  ];
}

export default function KnowledgeArticleRoute() {
  const params = useParams();
  const articleSlug = params["*"];
  
  // In a real implementation, this would load MDX content
  // For now, we'll show a placeholder that demonstrates the layout
  
  // Sample article data (would come from MDX)
  const article = {
    title: articleSlug === "self-pay" ? "Self-Pay Form Automation" : "Article Title",
    category: "Form Generator",
    lastUpdated: "2025-01-04",
    readTime: "5 min read",
    content: articleSlug === "self-pay" ? (
      <div className="prose prose-blue dark:prose-invert max-w-none">
        <p className="lead">
          The self-pay form automation feature in WCINYP helps streamline the patient billing process 
          by automatically generating personalized forms based on patient data, insurance status, and procedure type.
        </p>
        
        <h2>Overview</h2>
        <p>
          Self-pay form automation reduces manual entry errors and improves collection rates by:
        </p>
        <ul>
          <li>Pre-filling patient information from existing records</li>
          <li>Automatically calculating costs based on procedure codes</li>
          <li>Generating location-specific forms (55th Street, Broadway, etc.)</li>
          <li>Supporting multiple languages (English and Spanish)</li>
        </ul>
        
        <h2>Key Features</h2>
        <h3>1. Automatic Patient Data Population</h3>
        <p>
          When a patient is identified as self-pay, the system automatically retrieves patient demographic information,
          checks insurance eligibility status, identifies the service location, and determines the appropriate form template.
        </p>
        
        <h3>2. Dynamic Form Selection</h3>
        <p>The system intelligently selects the correct form based on:</p>
        <ul>
          <li><strong>Location</strong>: Each facility has its own ABN forms</li>
          <li><strong>Procedure Type</strong>: Special forms for Calcium Score, MRI, CT, etc.</li>
          <li><strong>Language Preference</strong>: English or Spanish versions</li>
          <li><strong>Insurance Status</strong>: Self-pay vs. off-hours insurance</li>
        </ul>
        
        <h2>Implementation Steps</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
          <pre className="text-sm">
{`1. Verify patient is self-pay or insurance is inactive
2. Confirm procedure type and location
3. Check for existing financial agreements
4. Generate appropriate form with pre-filled data
5. Review and obtain signature`}
          </pre>
        </div>
        
        <h2>Best Practices</h2>
        <Card className="my-4">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">Data Accuracy</h4>
            <ul className="text-sm space-y-1">
              <li>• Verify patient information before generation</li>
              <li>• Confirm procedure codes are correct</li>
              <li>• Double-check cost calculations</li>
              <li>• Ensure location-specific requirements are met</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="my-4">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">Compliance</h4>
            <ul className="text-sm space-y-1">
              <li>• Maintain HIPAA compliance</li>
              <li>• Follow Medicare ABN requirements</li>
              <li>• Document all financial discussions</li>
              <li>• Store signed forms securely</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    ) : (
      <div className="prose prose-blue dark:prose-invert max-w-none">
        <p>Article content for: {articleSlug}</p>
        <p>This would display MDX content loaded from the file system.</p>
      </div>
    )
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/knowledge" className="text-muted-foreground hover:text-primary">
              Knowledge Base
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li className="text-muted-foreground">{article.category}</li>
          <li className="text-muted-foreground">/</li>
          <li className="font-medium">{article.title}</li>
        </ol>
      </nav>
      
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{article.category}</span>
          <span>•</span>
          <span>Last updated: {article.lastUpdated}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
      </header>
      
      {/* Table of Contents */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">On this page</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#overview" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Overview</a></li>
            <li><a href="#key-features" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Key Features</a></li>
            <li><a href="#implementation-steps" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Implementation Steps</a></li>
            <li><a href="#best-practices" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Best Practices</a></li>
          </ul>
        </CardContent>
      </Card>
      
      {/* Article Content */}
      <article className="mb-12">
        {article.content}
      </article>
      
      {/* Article Footer */}
      <footer className="border-t pt-8">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm">
            ← Previous Article
          </Button>
          <Button variant="outline" size="sm">
            Next Article →
          </Button>
        </div>
        
        <Card className="mt-8 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Need more help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Button size="sm">Contact Support</Button>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}

export { ErrorBoundary };