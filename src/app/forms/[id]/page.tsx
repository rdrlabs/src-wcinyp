import { notFound } from 'next/navigation';
import FormBuilder from '@/components/FormBuilder';
import formTemplatesData from "@/data/form-templates.json";

interface PageProps {
  params: {
    id: string;
  };
}

export default function FormBuilderPage({ params }: PageProps) {
  const formId = Number(params.id);
  const template = formTemplatesData.templates.find(t => t.id === formId);
  
  if (!template) {
    notFound();
  }
  
  return <FormBuilder template={template} />;
}

// Generate static params for all form templates
export async function generateStaticParams() {
  return formTemplatesData.templates.map((template) => ({
    id: template.id.toString(),
  }));
}