import { Brain, Users, FileText, Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { urlConfig } from '@/config/app.config';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const mainNavItems: NavItem[] = [
  { href: '/knowledge', label: 'Knowledge Base', icon: Brain },
  { href: '/directory', label: 'Directory', icon: Users },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/updates', label: 'Updates', icon: Bell },
];

export const quickLinks = [
  { 
    href: urlConfig.microsoft.teams, 
    label: 'Teams',
    external: true 
  },
  { 
    href: urlConfig.microsoft.outlook, 
    label: 'Outlook',
    external: true 
  },
  { 
    href: urlConfig.microsoft.myApps, 
    label: 'MyApps',
    external: true 
  },
];

export const footerLinks = {
  resources: [
    {
      href: urlConfig.wcm,
      label: 'Weill Cornell Medicine',
      external: true,
    },
    {
      href: urlConfig.nyp,
      label: 'NewYork-Presbyterian',
      external: true,
    },
    {
      href: '/privacy',
      label: 'Privacy Policy',
      external: false,
    },
    {
      href: urlConfig.patientPortal,
      label: 'Patient Portal',
      external: true,
    },
  ],
  social: [
    { platform: 'Facebook', href: urlConfig.social.facebook },
    { platform: 'Twitter', href: urlConfig.social.twitter },
    { platform: 'LinkedIn', href: urlConfig.social.linkedin },
    { platform: 'YouTube', href: urlConfig.social.youtube },
  ],
};

export const contactInfo = {
  address: {
    street: '525 East 68th Street',
    city: 'New York, NY 10065',
  },
  phone: '(212) 746-2920',
  email: 'imaging@med.cornell.edu',
  hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
};