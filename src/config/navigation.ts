import { 
  Brain, 
  Users, 
  FileText, 
  Bell,
  BookOpen,
  HelpCircle,
  FileCode,
  UserCheck,
  Building2,
  Shield,
  FlaskConical,
  Package,
  Building,
  MapPin,
  UserPlus,
  Briefcase,
  FileBarChart,
  ClipboardCheck,
  GraduationCap,
  Hammer,
  FileStack,
  Megaphone,
  Activity
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  items?: NavSubItem[];
}

export interface NavSubItem {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export const mainNavItems: NavItem[] = [
  { 
    href: '/knowledge', 
    label: 'Knowledge Base', 
    icon: Brain,
    items: [
      { 
        href: '/knowledge/docs', 
        label: 'Documentation',
        description: 'Browse the full WCINYP documentation',
        icon: BookOpen
      },
      { 
        href: '/knowledge/getting-started', 
        label: 'Getting Started',
        description: 'Coming soon',
        icon: BookOpen
      },
      { 
        href: '/knowledge/user-guides', 
        label: 'User Guides',
        description: 'Coming soon',
        icon: FileCode
      },
      { 
        href: '/knowledge/faqs', 
        label: 'FAQs',
        description: 'Coming soon',
        icon: HelpCircle
      }
    ]
  },
  { 
    href: '/directory', 
    label: 'Directory', 
    icon: Users,
    items: [
      { 
        href: '/directory', 
        label: 'All Contacts',
        description: 'Complete contact directory',
        icon: Users
      },
      { 
        href: '/directory?type=Provider', 
        label: 'Providers',
        description: 'Medical providers and physicians',
        icon: UserCheck
      },
      { 
        href: '/directory?type=Facility', 
        label: 'Facilities',
        description: 'Medical facilities and locations',
        icon: Building2
      },
      { 
        href: '/directory?type=Insurance', 
        label: 'Insurance',
        description: 'Insurance companies and contacts',
        icon: Shield
      },
      { 
        href: '/directory?type=Lab', 
        label: 'Labs',
        description: 'Laboratory services',
        icon: FlaskConical
      },
      { 
        href: '/directory?type=Vendor', 
        label: 'Vendors',
        description: 'Equipment and service vendors',
        icon: Package
      },
      { 
        href: '/directory?type=Government', 
        label: 'Government',
        description: 'Government agencies and contacts',
        icon: Building
      },
      { 
        href: '/directory?type=Location', 
        label: 'Locations',
        description: 'Physical locations and addresses',
        icon: MapPin
      },
      { 
        href: '/directory?type=ReferringProvider', 
        label: 'Referring Providers',
        description: 'External referring physicians',
        icon: UserPlus
      }
    ]
  },
  { 
    href: '/documents', 
    label: 'Documents', 
    icon: FileText,
    items: [
      { 
        href: '/documents', 
        label: 'All Documents',
        description: 'Browse all documents',
        icon: FileStack
      },
      { 
        href: '/documents?category=Clinical', 
        label: 'Clinical Forms',
        description: 'Medical and clinical documentation',
        icon: Briefcase
      },
      { 
        href: '/documents?category=Administrative', 
        label: 'Administrative',
        description: 'Administrative forms and policies',
        icon: FileBarChart
      },
      { 
        href: '/documents?category=Consent', 
        label: 'Consent Forms',
        description: 'Patient consent documentation',
        icon: ClipboardCheck
      },
      { 
        href: '/documents?category=Insurance', 
        label: 'Insurance',
        description: 'Insurance forms and information',
        icon: Shield
      },
      { 
        href: '/documents?category=Patient Education', 
        label: 'Patient Education',
        description: 'Educational materials for patients',
        icon: GraduationCap
      },
      { 
        href: '/documents?tab=forms', 
        label: 'Form Builder',
        description: 'Create and manage forms',
        icon: Hammer
      }
    ]
  },
  { 
    href: '/updates', 
    label: 'Updates', 
    icon: Bell,
    items: [
      { 
        href: '/updates', 
        label: 'Recent Changes',
        description: 'Latest system updates',
        icon: Activity
      },
      { 
        href: '/updates/announcements', 
        label: 'Announcements',
        description: 'Important announcements',
        icon: Megaphone
      },
      { 
        href: '/updates/status', 
        label: 'System Status',
        description: 'Current system status',
        icon: Activity
      }
    ]
  }
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