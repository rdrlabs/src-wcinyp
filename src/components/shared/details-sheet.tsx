'use client';

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Plus, 
  Users, 
  Calendar,
  HardDrive,
  BarChart,
  Filter,
  Upload,
  Edit,
  Printer,
  FolderOpen,
  Shield,
  Building,
  TestTube,
  Package,
  User
} from "lucide-react";
import { getCategoryIcon } from "@/lib/icons";
import type { LucideIcon } from "lucide-react";

export interface DetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'category' | 'contact-type';
  data: CategoryData | ContactTypeData;
}

export interface CategoryData {
  name: string;
  type: 'documents' | 'forms';
  description?: string;
  count: number;
  totalSize?: string;
  lastUpdated?: string;
  items?: Array<{
    id: string;
    name: string;
    size?: string;
    date?: string;
    submissions?: number;
  }>;
}

export interface ContactTypeData {
  name: string;
  count: number;
  description?: string;
  recentContacts?: Array<{
    id: string;
    name: string;
    department?: string;
    email?: string;
    phone?: string;
  }>;
  statistics?: {
    active: number;
    inactive: number;
    newThisMonth: number;
  };
}

function getContactTypeIcon(type: string): LucideIcon {
  switch (type) {
    case 'Provider':
      return User;
    case 'Insurance':
      return Shield;
    case 'Facility':
      return Building;
    case 'Lab':
      return TestTube;
    case 'Vendor':
      return Package;
    default:
      return FolderOpen;
  }
}

export function DetailsSheet({ isOpen, onClose, type, data }: DetailsSheetProps) {
  const isDocumentCategory = type === 'category' && 'items' in data;
  const isContactType = type === 'contact-type' && 'recentContacts' in data;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            {type === 'category' ? (
              <div className="p-2 bg-primary/10 rounded-lg">
                {(() => {
                  const Icon = getCategoryIcon(data.name);
                  return <Icon className="h-6 w-6 text-primary" />;
                })()}
              </div>
            ) : (
              <div className="p-2 bg-primary/10 rounded-lg">
                {(() => {
                  const Icon = getContactTypeIcon((data as ContactTypeData).name);
                  return <Icon className="h-6 w-6 text-primary" />;
                })()}
              </div>
            )}
            <div>
              <SheetTitle className="text-xl">{data.name}</SheetTitle>
              {data.description && (
                <SheetDescription>{data.description}</SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Statistics Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Count</p>
                  <p className="text-2xl font-bold">{data.count}</p>
                </div>
                
                {isDocumentCategory && (data as CategoryData).totalSize && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Size</p>
                    <p className="text-2xl font-bold">{(data as CategoryData).totalSize}</p>
                  </div>
                )}
                
                {isContactType && (data as ContactTypeData).statistics && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold text-green-600">
                        {(data as ContactTypeData).statistics!.active}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">New This Month</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {(data as ContactTypeData).statistics!.newThisMonth}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {isDocumentCategory ? (
                <>
                  <Button size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download All
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload New
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    Print Batch
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Apply Filters
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New {(data as ContactTypeData).name}
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export List
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Bulk Edit
                  </Button>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Recent Items */}
          {isDocumentCategory && (data as CategoryData).items && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Recent {(data as CategoryData).type === 'documents' ? 'Documents' : 'Forms'}
              </h3>
              <div className="space-y-2">
                {(data as CategoryData).items!.slice(0, 5).map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <p className="text-sm font-medium truncate">{item.name}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          {item.size && (
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              {item.size}
                            </span>
                          )}
                          {item.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {item.date}
                            </span>
                          )}
                          {item.submissions !== undefined && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {item.submissions} submissions
                            </span>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recent Contacts */}
          {isContactType && (data as ContactTypeData).recentContacts && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Recent Contacts</h3>
              <div className="space-y-2">
                {(data as ContactTypeData).recentContacts!.slice(0, 5).map((contact) => (
                  <Card key={contact.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{contact.name}</p>
                        {contact.department && (
                          <p className="text-xs text-muted-foreground">{contact.department}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {contact.email && <span>{contact.email}</span>}
                          {contact.phone && <span>{contact.phone}</span>}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}