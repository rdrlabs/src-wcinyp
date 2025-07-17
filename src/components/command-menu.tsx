'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Users,
  Home,
  Settings,
  LogIn,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { mainNavItems } from "@/config/navigation";
import documentsData from "@/data/documents.json";
import providersData from "@/data/providers.json";
import contactsData from "@/data/contacts.json";
import { useSearchContext } from "@/contexts/search-context";

// Extract documents from categories
const allDocuments = Object.values(documentsData.categories).flat();

export function CommandMenu() {
  const router = useRouter();
  const { isOpen, closeCommandMenu, toggleCommandMenu } = useSearchContext();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandMenu();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleCommandMenu]);

  const runCommand = (command: () => void) => {
    closeCommandMenu();
    command();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && closeCommandMenu()}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push('/login'))}>
            <LogIn className="mr-2 h-4 w-4" />
            <span>Login</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Documents">
          {allDocuments.slice(0, 5).map((doc, index) => (
            <CommandItem
              key={index}
              onSelect={() => runCommand(() => {
                router.push('/documents');
                // You could implement document-specific actions here
              })}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>{doc.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Providers">
          {providersData.providers.slice(0, 5).map((provider) => (
            <CommandItem
              key={provider.id}
              onSelect={() => runCommand(() => {
                router.push('/directory');
                // You could implement provider-specific actions here
              })}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>{provider.name} - {provider.specialty}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Contacts">
          {contactsData.contacts.slice(0, 5).map((contact) => (
            <CommandItem
              key={contact.id}
              onSelect={() => runCommand(() => {
                router.push('/directory');
                // You could implement contact-specific actions here
              })}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>{contact.name} - {contact.department}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}