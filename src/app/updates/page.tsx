'use client';

import { 
  Newspaper, 
  Mail, 
  Megaphone, 
  Calendar,
  FileText,
  Bell
} from "lucide-react";
import { ComingSoonCard } from "@/components/coming-soon-card";

export default function UpdatesPage() {
  const sections = [
    {
      icon: Newspaper,
      title: "Marketing Blog Posts",
      description: "Latest articles and blog posts from our marketing team highlighting new services, technology updates, and patient success stories",
      isPlaceholder: false
    },
    {
      icon: Mail,
      title: "Operational Updates",
      description: "Important departmental emails and operational announcements affecting daily workflows, schedules, and procedures",
      isPlaceholder: false
    },
    {
      icon: Megaphone,
      title: "General Announcements",
      description: "Facility-wide communications including policy changes, system maintenance notifications, and organizational news",
      isPlaceholder: false
    },
    {
      icon: Calendar,
      title: "Upcoming Events",
      description: "Department meetings, training sessions, and other scheduled events relevant to imaging center operations",
      isPlaceholder: false
    },
    {
      icon: FileText,
      title: "Policy Updates",
      description: "Changes to clinical protocols, administrative procedures, and compliance requirements",
      isPlaceholder: false
    },
    {
      icon: Bell,
      title: "System Notifications",
      description: "Technical updates, scheduled downtime, and IT-related communications affecting imaging systems",
      isPlaceholder: false
    }
  ];

  const footer = (
    <div className="text-center mt-12">
      <p className="text-sm text-muted-foreground">
        Have news to share or need to post an update? Contact the Communications team at{" "}
        <a href="mailto:imaging-comms@med.cornell.edu" className="text-primary hover:underline">
          imaging-comms@med.cornell.edu
        </a>
      </p>
    </div>
  );

  return (
    <ComingSoonCard
      description="Stay informed with the latest news, operational updates, and important communications"
      sections={sections}
      footer={footer}
    />
  );
}