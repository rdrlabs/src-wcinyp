'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import providersData from "@/data/providers.json";
import type { Provider } from "@/types";
import { 
  Search, 
  ChevronRight, 
  Stethoscope, 
  Brain, 
  Heart, 
  Bone,
  Eye,
  Activity,
  MapPin,
  Phone,
  Mail,
  Building2
} from "lucide-react";

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const providers: Provider[] = providersData.providers;
  
  // Get icon for specialty
  const getSpecialtyIcon = (specialty: string) => {
    const specialtyLower = specialty.toLowerCase();
    if (specialtyLower.includes('radiology') || specialtyLower.includes('imaging')) {
      return <Activity className="h-4 w-4" />;
    } else if (specialtyLower.includes('neuro')) {
      return <Brain className="h-4 w-4" />;
    } else if (specialtyLower.includes('cardio') || specialtyLower.includes('heart')) {
      return <Heart className="h-4 w-4" />;
    } else if (specialtyLower.includes('ortho') || specialtyLower.includes('bone')) {
      return <Bone className="h-4 w-4" />;
    } else if (specialtyLower.includes('ophthalm') || specialtyLower.includes('eye')) {
      return <Eye className="h-4 w-4" />;
    } else {
      return <Stethoscope className="h-4 w-4" />;
    }
  };
  
  // Filter providers based on search
  const filteredProviders = searchTerm
    ? providers.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : providers;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Provider Directory</h1>
        <p className="text-muted-foreground mt-2">
          Medical staff contact information and specialties
        </p>
      </div>
      
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search providers by name, specialty, department, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {searchTerm && filteredProviders.length === 0 
              ? `No providers found matching "${searchTerm}"`
              : `${filteredProviders.length} providers in directory`
            }
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProviders.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getSpecialtyIcon(provider.specialty)}
                    {provider.specialty}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    {provider.department}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                    <MapPin className="h-3 w-3" />
                    {provider.location}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {provider.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {provider.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                    View Details
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}