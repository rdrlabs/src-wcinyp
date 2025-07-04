import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { useState, useEffect } from "react";

export function meta() {
  return [
    { title: "Form Builder - WCINYP Admin" },
    { name: "description", content: "Create and manage medical forms" },
  ];
}

export default function FormsRoute() {
  const [templates, setTemplates] = useState([
    { 
      id: 1, 
      name: "Patient Intake Form", 
      fields: 12,
      lastUsed: "2025-07-02",
      submissions: 234
    },
    { 
      id: 2, 
      name: "Insurance Verification", 
      fields: 8,
      lastUsed: "2025-07-03",
      submissions: 156
    },
    { 
      id: 3, 
      name: "Medical History Questionnaire", 
      fields: 24,
      lastUsed: "2025-07-01",
      submissions: 89
    },
    { 
      id: 4, 
      name: "Consent for Treatment", 
      fields: 6,
      lastUsed: "2025-07-03",
      submissions: 312
    },
  ]);
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Form Builder</h1>
        <p className="text-muted-foreground mt-2">
          Create and customize medical forms and templates
        </p>
      </div>
      
      <div className="mb-6 flex gap-4">
        <Button>Create New Form</Button>
        <Button variant="outline">Import Template</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>
                {template.fields} fields • {template.submissions} submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Last used: {template.lastUsed}
                </p>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { ErrorBoundary };