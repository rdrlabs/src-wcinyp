'use client';

import { 
  Box,
  CalendarSync,
  Magnet,
  MessageCircleQuestion,
  Wind,
  Volume2
} from "lucide-react";
import { ComingSoonCard } from "@/components/coming-soon-card";

export default function LabsPage() {
  const sections = [
    {
      icon: Box,
      title: "MRI 3D Visualization Suite",
      description: "Interactive 3D models to scale with adjustable patient height, table sliding animations, and common positioning references, for different scanner models",
      isPlaceholder: false
    },
    {
      icon: CalendarSync,
      title: "Centralized SPC Schedule",
      description: "View the full Schedulefly schedule natively! Future potential: vCard sync to your phone calendar",
      isPlaceholder: false
    },
    {
      icon: Magnet,
      title: "Playing with Magnets",
      description: "Virtual MRI room where you can test what happens when you 'accidentally' bring in that neodymium magnet you ordered on TikTok Shop",
      isPlaceholder: true
    },
    {
      icon: MessageCircleQuestion,
      title: "Hm, let me run this one by...",
      description: "Rather than ask the same questions, redirect your queries to Cornellius, an AI chatbot that forces you to find the answer in the knowledge base",
      isPlaceholder: true
    },
    {
      icon: Wind,
      title: "Scan Breathhold Simulator",
      description: "Oh so you think it's easy? BREATHE IN. BREATHE OUT. Don't breathe again.",
      isPlaceholder: true
    },
    {
      icon: Volume2,
      title: "MRI Sound Remix",
      description: "Turn those gradient noises into sick beats, make a new playlist for the lobby!",
      isPlaceholder: true
    }
  ];

  const footer = (
    <div className="text-center mt-12">
      <p className="text-sm text-muted-foreground">
        🧲 Have ideas for experimental features? We&apos;re always looking for ways to improve!{" "}
        <br />
        Submit your suggestions to{" "}
        <a href="mailto:imaging-innovation@med.cornell.edu" className="text-primary hover:underline">
          imaging-innovation@med.cornell.edu
        </a>
      </p>
    </div>
  );

  return (
    <ComingSoonCard
      description="Imaging meets imagination"
      sections={sections}
      footer={footer}
    />
  );
}