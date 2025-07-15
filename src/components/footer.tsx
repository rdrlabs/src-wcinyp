'use client';

import Link from 'next/link';
import { 
  Brain, FileText, Bell, Users,
  Calendar, LayoutGrid, Building, MessageSquare, 
  Mail, Infinity, BookOpen, Cloud, ExternalLink
} from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function Footer() {
  const navigation = [
    { name: 'Knowledge Base', href: '/knowledge', icon: Brain },
    { name: 'Document Hub', href: '/documents', icon: FileText },
    { name: 'Updates', href: '/updates', icon: Bell },
    { name: 'Directory', href: '/directory', icon: Users },
  ];

  const quickLinks = [
    { 
      name: 'Schedulefly', 
      href: 'https://app.schedulefly.com/login.aspx',
      icon: Calendar,
      description: 'Staff scheduling'
    },
    { 
      name: 'WCM MyApps', 
      href: 'http://myapps.med.cornell.edu/',
      icon: LayoutGrid,
      description: 'Application portal'
    },
    { 
      name: 'Microsoft Office 365', 
      href: 'https://m365.cloud.microsoft/',
      icon: Building,
      description: 'Microsoft 365 suite'
    },
    { 
      name: 'Microsoft Teams', 
      href: 'https://teams.microsoft.com/',
      icon: MessageSquare,
      description: 'Team collaboration'
    },
    { 
      name: 'Microsoft Outlook', 
      href: 'https://outlook.office.com/mail/',
      icon: Mail,
      description: 'Email & calendar'
    },
    { 
      name: 'Microsoft Loop', 
      href: 'https://loop.cloud.microsoft/',
      icon: Infinity,
      description: 'Collaborative workspace'
    },
    { 
      name: 'WCINYP Manual', 
      href: 'https://medcornell.sharepoint.com/:o:/r/sites/WCINYPScheduling2/Shared%20Documents/General/WCINYP%20Manuals?d=w5586d765a0454ddb88429ca08869de08&csf=1&web=1&e=dAGCMc',
      icon: BookOpen,
      description: 'OneNote manual'
    },
    { 
      name: 'Public Drive', 
      href: 'https://medcornell-my.sharepoint.com/:f:/r/personal/vip2008_med_cornell_edu/Documents/Public?csf=1&web=1&e=wfkQce',
      icon: Cloud,
      description: 'OneDrive shared folder'
    },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Navigation Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <a 
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.description}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            WCI<span className="text-primary">@</span>NYP is a project currently in development by{" "}
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary">@</span>Ray
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Ray Contreras</h4>
                  <p className="text-sm text-muted-foreground">Senior Patient Coordinator</p>
                  <a 
                    href="mailto:rco4001@med.cornell.edu" 
                    className="text-sm text-primary hover:underline"
                  >
                    rco4001@med.cornell.edu
                  </a>
                </div>
              </HoverCardContent>
            </HoverCard>
          </p>
          
          {/* Temporary test link */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link href="/test-niivue-volumetric" className="hover:text-primary underline">
              Test NiiVue Settings
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}