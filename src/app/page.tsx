'use client';

import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { 
  Brain, FileText, Bell, Users,
  Box, CalendarSync, ArrowRight,
  Rocket, Sparkles
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll } from "framer-motion";
import "./landing.css";

export default function Home() {
  const [_activeSection, setActiveSection] = useState(0);
  const { scrollYProgress } = useScroll();

  // Section IDs for navigation
  const sections = useMemo(() => ['hero', 'knowledge', 'documents', 'updates', 'directory', 'ideas'], []);

  useEffect(() => {
    const handleScroll = () => {
      // Determine active section
      const sectionElements = sections.map(id => document.getElementById(id));
      const currentSection = sectionElements.findIndex(el => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });
      
      if (currentSection !== -1) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Hero content
  const heroContent = {
    title: "WCINYP",
    subtitle: "Medical Imaging Platform",
    description: "Unified dashboard for modern healthcare",
    cta: {
      text: "Get Started",
      href: "#knowledge"
    }
  };


  // Main features
  const features = [
    {
      id: 'knowledge',
      icon: Brain,
      title: "Knowledge Base",
      description: "Technical documentation, user guides, and best practices",
      href: "/knowledge",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: ["Documentation", "Tutorials", "Best Practices", "Training", "Quick Guides"]
    },
    {
      id: 'documents',
      icon: FileText,
      title: "Document Hub",
      description: "Centralized repository for all medical documents",
      href: "/documents",
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: ["Patient Forms", "Templates", "Version Control", "Admin Papers", "Form Builder"]
    },
    {
      id: 'updates',
      icon: Bell,
      title: "Updates",
      description: "Latest news and important announcements",
      href: "/updates",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      items: ["Department News", "Announcements", "Policy Updates", "Events", "Operations"]
    },
    {
      id: 'directory',
      icon: Users,
      title: "Directory",
      description: "Complete contact database for all stakeholders",
      href: "/directory",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: ["Staff Directory", "Providers", "Facilities", "Partners", "Quick Search"]
    }
  ];

  // Future innovations
  const innovations = [
    {
      icon: Box,
      title: "MRI 3D Visualization",
      description: "Interactive 3D models with patient positioning guides",
      status: "In Development"
    },
    {
      icon: CalendarSync,
      title: "Centralized Scheduling",
      description: "Native schedule view with calendar sync",
      status: "Coming Q2 2025"
    }
  ];

  return (
    <>
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/10 backdrop-blur-sm">
        <motion.div 
          className="h-full bg-primary relative"
          style={{ 
            scaleX: scrollYProgress,
            transformOrigin: "left",
            boxShadow: `0 0 10px rgba(var(--color-primary-rgb), 0.5), 0 0 20px rgba(var(--color-primary-rgb), 0.3)` 
          }}
        >
          {/* Leading glow effect */}
          <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-primary to-transparent blur-sm" />
        </motion.div>
      </motion.div>



      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background animate-gradient" />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[128px]" />
        </div>

        <motion.div 
          className="container mx-auto px-4 text-center max-w-5xl relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight relative">
              <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                {heroContent.title}
              </span>
              {/* Shimmer overlay */}
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-clip-text"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
                style={{ maskImage: 'linear-gradient(to right, transparent, black, transparent)' }}
              />
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-4 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {heroContent.subtitle}
          </motion.p>
          
          <motion.p 
            className="text-base md:text-lg text-muted-foreground/80 mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {heroContent.description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <GlowButton
              size="lg"
              onClick={() => scrollToSection('knowledge')}
              className="group"
            >
              {heroContent.cta.text}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </GlowButton>
          </motion.div>
        </motion.div>
        
      </section>


      {/* Main Features */}
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const isEven = index % 2 === 0;
        return (
          <section 
            key={feature.id}
            id={feature.id} 
            className="py-24 md:py-32 relative overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-6xl mx-auto">
                <Link href={feature.href} className="group block">
                  <motion.div 
                    className={cn(
                      "flex flex-col lg:flex-row items-center gap-12 md:gap-20",
                      !isEven && "lg:flex-row-reverse"
                    )}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {/* Icon and Title */}
                    <motion.div 
                      className="flex-1 text-center lg:text-left"
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    >
                      <motion.div 
                        className="inline-flex p-6 rounded-3xl bg-primary/10 mb-8"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="h-20 w-20 text-primary" strokeWidth={1} />
                      </motion.div>
                      <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        {feature.title}
                      </h2>
                      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                        {feature.description}
                      </p>
                      <GlowButton size="lg" className="group/btn">
                        Explore {feature.title}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </GlowButton>
                    </motion.div>

                    {/* Feature Items */}
                    <div className="flex-1 w-full">
                      <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.1
                            }
                          }
                        }}
                      >
                        {feature.items.map((item) => (
                          <motion.div
                            key={item}
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <GlassCard 
                              className="p-6 h-full group/card cursor-pointer"
                              whileHover={{ 
                                y: -4,
                                transition: { duration: 0.2 }
                              }}
                            >
                              <h3 className="text-base md:text-lg font-medium group-hover/card:text-primary transition-colors">
                                {item}
                              </h3>
                              <Sparkles className="h-4 w-4 text-primary opacity-0 group-hover/card:opacity-100 transition-opacity mt-2" />
                            </GlassCard>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      {/* Ideas Section */}
      <section id="ideas" className="py-24 md:py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px] animate-pulse" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Rocket className="h-16 w-16 text-primary" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Coming Soon</h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Next-generation features in development
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {innovations.map((innovation) => {
              const Icon = innovation.icon;
              return (
                <motion.div
                  key={innovation.title}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-8 h-full hover:shadow-[0_0_60px_rgba(0,102,255,0.1)] transition-shadow duration-500">
                    <div className="flex gap-6">
                      <motion.div 
                        className="p-4 rounded-2xl bg-primary/10 h-fit"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="h-10 w-10 text-primary" strokeWidth={1} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-3">{innovation.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{innovation.description}</p>
                        <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {innovation.status}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}