import { BookOpen, Home, FileText, Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const mainNavItems: NavItem[] = [
  { href: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
  { href: '/directory', label: 'Directory', icon: Home },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/updates', label: 'Updates', icon: Bell },
];

export const quickLinks = [
  { 
    href: 'https://teams.microsoft.com', 
    label: 'Teams',
    external: true 
  },
  { 
    href: 'https://outlook.office.com', 
    label: 'Outlook',
    external: true 
  },
  { 
    href: 'https://myapps.microsoft.com', 
    label: 'MyApps',
    external: true 
  },
];

export const footerLinks = {
  resources: [
    {
      href: 'https://weillcornell.org',
      label: 'Weill Cornell Medicine',
      external: true,
    },
    {
      href: 'https://nyp.org',
      label: 'NewYork-Presbyterian',
      external: true,
    },
    {
      href: '#',
      label: 'Privacy Policy',
      external: false,
    },
    {
      href: '#',
      label: 'Patient Portal',
      external: false,
    },
  ],
  social: [
    { platform: 'Facebook', href: '#' },
    { platform: 'Twitter', href: '#' },
    { platform: 'LinkedIn', href: '#' },
    { platform: 'YouTube', href: '#' },
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