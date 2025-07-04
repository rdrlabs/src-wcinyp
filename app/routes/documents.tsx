import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { useState, useEffect } from "react";

export default function DocumentsRoute() {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Patient Consent Form.pdf", size: "245 KB", updatedAt: "2025-07-03" },
    { id: 2, name: "Insurance Verification.docx", size: "189 KB", updatedAt: "2025-07-02" },
    { id: 3, name: "Medical History.pdf", size: "512 KB", updatedAt: "2025-07-01" },
  ]);
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Document Hub</h1>
        <p className="text-muted-foreground mt-2">
          Manage medical documents and forms
        </p>
      </div>
      
      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{doc.name}</CardTitle>
                  <CardDescription>
                    {doc.size} • Updated {doc.updatedAt}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      <div className="mt-8">
        <Button>Upload New Document</Button>
      </div>
    </div>
  );
}

export { ErrorBoundary };