'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileEdit, Eye, ArrowRight, FileText, Users } from 'lucide-react';
import formTemplatesData from '@/data/form-templates.json';
import Link from 'next/link';

export function FormsList() {
  const groupedTemplates = formTemplatesData.templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof formTemplatesData.templates>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedTemplates).map(([category, templates]) => (
        <div key={category} className="p-6 bg-muted-lighter/30 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-4 capitalize p-3 bg-background rounded-md border-l-4 border-primary">{category.replace('-', ' ')}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} variant="elevated" className="hover:shadow-lg transition-all hover:border-border-strong" data-testid={`form-template-${template.id}`}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileEdit className="h-4 w-4" />
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {template.fields} fields
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {template.submissions} submissions
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <Link href={`/forms/${template.id}?preview=true`} data-testid={`preview-button-${template.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/forms/${template.id}`} data-testid={`fill-button-${template.id}`}>
                          Fill Out
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}