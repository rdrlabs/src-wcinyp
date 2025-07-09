'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import contactsData from "@/data/contacts.json";
import providersData from "@/data/providers.json";
import type { Contact, Provider } from "@/types";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { 
  User, 
  Shield, 
  Building, 
  TestTube, 
  Package,
  Phone,
  Mail,
  MapPin,
  Search,
  Download,
  ChevronDown
} from "lucide-react";
import { DataTable, createSortableHeader, createActionsColumn } from "@/components/ui/data-table";
import { DetailsSheet, type ContactTypeData } from "@/components/shared";
import type { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DirectoryPage() {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTypeDetails, setSelectedTypeDetails] = useState<ContactTypeData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  
  const contacts: Contact[] = contactsData.contacts as Contact[];
  const providers: Provider[] = providersData.providers as Provider[];
  
  // Calculate type counts
  const totalContacts = contacts.length;
  const providerCount = contacts.filter(c => c.type === 'Provider').length;
  const facilityCount = contacts.filter(c => c.type === 'Facility').length;
  const vendorCount = contacts.filter(c => c.type === 'Vendor').length;
  const insuranceCount = contacts.filter(c => c.type === 'Insurance').length;
  const labCount = contacts.filter(c => c.type === 'Lab').length;
  const governmentCount = contacts.filter(c => c.type === 'Government').length;
  
  // Get count for contact type
  const getTypeCount = (type: string) => {
    switch (type) {
      case 'all':
        return totalContacts;
      case 'Provider':
        return providerCount;
      case 'Insurance':
        return insuranceCount;
      case 'Facility':
        return facilityCount;
      case 'Lab':
        return labCount;
      case 'Vendor':
        return vendorCount;
      case 'Government':
        return governmentCount;
      default:
        return 0;
    }
  };
  
  // Get icon for contact type
  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'Provider':
        return <User className="h-4 w-4" />;
      case 'Insurance':
        return <Shield className="h-4 w-4" />;
      case 'Facility':
        return <Building className="h-4 w-4" />;
      case 'Lab':
        return <TestTube className="h-4 w-4" />;
      case 'Vendor':
        return <Package className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Combine contacts and providers
  const allItems = useMemo(() => {
    const contactsWithType = contacts.map(c => ({ ...c, itemType: 'contact' as const }));
    const providersWithType = providers.map(p => ({ ...p, itemType: 'provider' as const, type: 'Provider' as const }));
    return [...contactsWithType, ...providersWithType];
  }, [contacts, providers]);

  // Filter items based on selected tab
  const filteredByTab = useMemo(() => {
    if (selectedTab === 'all') return allItems;
    if (selectedTab === 'providers') return allItems.filter(item => item.itemType === 'provider');
    return allItems.filter(item => item.itemType === 'contact' && item.type === selectedTab);
  }, [allItems, selectedTab]);

  // Apply search filter
  const filteredItems = useMemo(() => {
    if (!searchQuery) return filteredByTab;
    const query = searchQuery.toLowerCase();
    return filteredByTab.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.department && item.department.toLowerCase().includes(query)) ||
      (item.email && item.email.toLowerCase().includes(query)) ||
      (item.phone && item.phone.toLowerCase().includes(query))
    );
  }, [filteredByTab, searchQuery]);

  // Handle tab click for details sheet
  const handleTabClick = (tab: string) => {
    const tabContacts = tab === 'all' 
      ? contacts 
      : tab === 'providers'
      ? []
      : contacts.filter(c => c.type === tab);
    
    const recentContacts = tabContacts.slice(0, 5).map(c => ({
      id: c.id.toString(),
      name: c.name,
      department: c.department,
      email: c.email,
      phone: c.phone
    }));
    
    const activeCount = Math.floor(tabContacts.length * 0.8); // Mock data - assume 80% active
    const newThisMonth = Math.floor(tabContacts.length * 0.1); // Mock data
    
    setSelectedTypeDetails({
      name: tab === 'all' ? 'All Contacts' : tab === 'providers' ? 'Providers' : tab,
      count: tab === 'all' ? totalContacts : tab === 'providers' ? providers.length : getTypeCount(tab),
      description: tab === 'all' 
        ? 'View all contacts across all categories' 
        : tab === 'providers'
        ? 'View all referring providers'
        : `View all ${tab.toLowerCase()} contacts`,
      recentContacts,
      statistics: {
        active: activeCount,
        inactive: tabContacts.length - activeCount,
        newThisMonth
      }
    });
    
    setIsDetailsOpen(true);
  };

  // Define columns for unified table
  type UnifiedItem = (Contact & { itemType: 'contact' }) | (Provider & { itemType: 'provider'; type: 'Provider' });
  const columns: ColumnDef<UnifiedItem>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => createSortableHeader(column, 'Name'),
      cell: ({ row }) => <span className="font-semibold">{row.getValue('name')}</span>
    },
    {
      accessorKey: 'type',
      header: ({ column }) => createSortableHeader(column, 'Type'),
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return (
          <Badge 
            variant="secondary"
            className="flex items-center gap-2 w-fit"
          >
            {getContactTypeIcon(type)}
            {type}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'department',
      header: ({ column }) => createSortableHeader(column, 'Department'),
    },
    {
      id: 'contactInfo',
      header: 'Contact Info',
      cell: ({ row }) => (
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {row.original.phone}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {row.original.email}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'location',
      header: ({ column }) => createSortableHeader(column, 'Location'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {row.getValue('location')}
        </div>
      )
    },
    createActionsColumn<UnifiedItem>([
      {
        label: 'View Details',
        onClick: (item) => console.log('View', item),
      },
      {
        label: 'Edit',
        onClick: (item) => console.log('Edit', item),
      },
      {
        label: 'Export',
        onClick: (item) => console.log('Export', item),
        icon: <Download className="h-4 w-4" />
      }
    ])
  ], []);

  // Available columns for visibility control
  const availableColumns = useMemo(() => {
    return columns
      .filter(col => col.id !== 'actions')
      .map(col => {
        const columnDef = col as ColumnDef<UnifiedItem> & { accessorKey?: string };
        const columnId = col.id || columnDef.accessorKey;
        return {
          id: columnId as string,
          label: columnId === 'contactInfo' ? 'Contact Info' :
                 columnDef.accessorKey || columnId
        };
      });
  }, [columns]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Page Header */}
      <div className="space-y-1 mb-6">
        <h1 className={TYPOGRAPHY.pageTitle}>Contact Directory</h1>
        <p className={cn(TYPOGRAPHY.pageDescription)}>
          Comprehensive database of contacts and referring providers
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 overflow-hidden">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max overflow-x-auto">
            <TabsTrigger value="all" onClick={() => handleTabClick('all')} className="whitespace-nowrap">
              All ({totalContacts + providers.length})
            </TabsTrigger>
            <TabsTrigger value="Provider" onClick={() => handleTabClick('Provider')} className="whitespace-nowrap">
              Providers ({providerCount})
            </TabsTrigger>
            <TabsTrigger value="Facility" onClick={() => handleTabClick('Facility')} className="whitespace-nowrap">
              Facilities ({facilityCount})
            </TabsTrigger>
            <TabsTrigger value="Insurance" onClick={() => handleTabClick('Insurance')} className="whitespace-nowrap">
              Insurance ({insuranceCount})
            </TabsTrigger>
            <TabsTrigger value="Lab" onClick={() => handleTabClick('Lab')} className="whitespace-nowrap">
              Labs ({labCount})
            </TabsTrigger>
            <TabsTrigger value="Vendor" onClick={() => handleTabClick('Vendor')} className="whitespace-nowrap">
              Vendors ({vendorCount})
            </TabsTrigger>
            <TabsTrigger value="Government" onClick={() => handleTabClick('Government')} className="whitespace-nowrap">
              Government ({governmentCount})
            </TabsTrigger>
            <TabsTrigger value="providers" onClick={() => handleTabClick('providers')} className="whitespace-nowrap">
              Referring ({providers.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={columnVisibility[column.id] !== false}
                onCheckedChange={(value) =>
                  setColumnVisibility(prev => ({ ...prev, [column.id]: value }))
                }
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filteredItems}
            showColumnVisibility={false}
            showPagination={true}
            pageSize={15}
            enableRowSelection={false}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            onRowClick={(item) => {
              // Open details sheet for individual item
              const itemType = item.itemType === 'provider' ? 'Provider' : item.type;
              
              setSelectedTypeDetails({
                name: `${item.name} - ${itemType}`,
                count: 1,
                description: `Details for ${item.name}`,
                recentContacts: [{
                  id: item.id.toString(),
                  name: item.name,
                  department: item.itemType === 'provider' ? (item.department || item.specialty) : item.department,
                  email: item.email,
                  phone: item.phone
                }],
                statistics: {
                  active: 1,
                  inactive: 0,
                  newThisMonth: 0
                }
              });
              
              setIsDetailsOpen(true);
            }}
          />
        </CardContent>
      </Card>
      
      {/* Details Sheet */}
      {selectedTypeDetails && (
        <DetailsSheet
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          type="contact-type"
          data={selectedTypeDetails}
        />
      )}
    </div>
  );
}