'use client';

import { 
  Search, Shield, Wifi, Smartphone, FileText, GitBranch, Lock, Plug,
  Zap, Database, Cloud, Layers
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: "Real-time Search",
    description: "Instant search across all documents and data"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and HIPAA compliance"
  },
  {
    icon: Wifi,
    title: "Offline Capable",
    description: "Works seamlessly without internet connection"
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Optimized for all devices and screen sizes"
  },
  {
    icon: FileText,
    title: "Smart Forms",
    description: "Dynamic form generation with validation"
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Track changes and restore previous versions"
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    description: "Granular permissions for every user level"
  },
  {
    icon: Plug,
    title: "API Integrations",
    description: "Connects with existing hospital systems"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-second response times"
  },
  {
    icon: Database,
    title: "Smart Caching",
    description: "Intelligent data caching for speed"
  },
  {
    icon: Cloud,
    title: "Cloud Native",
    description: "Built for modern cloud infrastructure"
  },
  {
    icon: Layers,
    title: "Modular Design",
    description: "Flexible architecture for easy updates"
  }
];

export function FeatureCarousel() {
  return (
    <div className="w-full">
      <h2 className="text-center text-sm font-medium text-muted-foreground mb-4">
        Platform Capabilities
      </h2>
      <div className="relative w-full overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-muted/30 to-background" />
        
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        
        <div className="relative">
          <div className="animate-scroll">
          {/* Duplicate the features array for seamless loop */}
          {[...features, ...features].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="inline-flex items-center gap-3 px-6 py-4 whitespace-nowrap"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}