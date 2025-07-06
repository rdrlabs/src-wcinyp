'use client';

import { 
  Newspaper, 
  Mail, 
  Megaphone, 
  Calendar,
  FileText,
  Bell
} from "lucide-react";

export default function UpdatesPage() {
  const sections = [
    {
      icon: Newspaper,
      title: "Marketing Blog Posts",
      description: "Latest articles and blog posts from our marketing team highlighting new services, technology updates, and patient success stories",
      status: "3 new posts this week"
    },
    {
      icon: Mail,
      title: "Operational Updates",
      description: "Important departmental emails and operational announcements affecting daily workflows, schedules, and procedures",
      status: "Last update: 2 days ago"
    },
    {
      icon: Megaphone,
      title: "General Announcements",
      description: "Facility-wide communications including policy changes, system maintenance notifications, and organizational news",
      status: "5 active announcements"
    },
    {
      icon: Calendar,
      title: "Upcoming Events",
      description: "Department meetings, training sessions, and other scheduled events relevant to imaging center operations",
      status: "Next event: Tomorrow"
    },
    {
      icon: FileText,
      title: "Policy Updates",
      description: "Changes to clinical protocols, administrative procedures, and compliance requirements",
      status: "Updated this month"
    },
    {
      icon: Bell,
      title: "System Notifications",
      description: "Technical updates, scheduled downtime, and IT-related communications affecting imaging systems",
      status: "All systems operational"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Updates</h1>
        <p className="text-muted-foreground mt-2">
          Stay informed with the latest news, operational updates, and important communications
        </p>
      </div>
      
      <div className="text-center py-12 border rounded-lg bg-muted/10">
        <h2 className="text-2xl font-semibold mb-8">Coming Soon</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="p-6 border rounded-lg bg-background hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {section.description}
                </p>
                <p className="text-xs font-medium text-primary">
                  {section.status}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}