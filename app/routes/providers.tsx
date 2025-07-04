import type { Route } from "./+types/providers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ErrorBoundary } from "~/components/ErrorBoundary";

export async function loader({ request }: Route.LoaderArgs) {
  // This will become a Netlify Function
  // For now, return mock data
  const providers = [
    { 
      id: 1, 
      name: "Dr. Sarah Johnson", 
      specialty: "Radiology",
      department: "Imaging",
      phone: "(212) 555-0101"
    },
    { 
      id: 2, 
      name: "Dr. Michael Chen", 
      specialty: "Nuclear Medicine",
      department: "PET/CT",
      phone: "(212) 555-0102"
    },
    { 
      id: 3, 
      name: "Dr. Emily Rodriguez", 
      specialty: "Interventional Radiology",
      department: "Procedures",
      phone: "(212) 555-0103"
    },
  ];
  
  return { providers };
}

export default function ProvidersRoute({ loaderData }: Route.ComponentProps) {
  const { providers } = loaderData;
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Provider Directory</h1>
        <p className="text-muted-foreground mt-2">
          Medical staff contact information and specialties
        </p>
      </div>
      
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search providers..."
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <CardTitle>{provider.name}</CardTitle>
              <CardDescription>{provider.specialty}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Department:</span> {provider.department}</p>
                <p><span className="font-medium">Phone:</span> {provider.phone}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { ErrorBoundary };