'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Users, 
  Search,
  Stethoscope,
  Microscope,
  HeartHandshake,
  ClipboardList,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LostStethoscope } from '@/components/illustrations/lost-stethoscope';
import { useSearchContext } from '@/contexts/search-context';
import { useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const { openCommandMenu } = useSearchContext();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      openCommandMenu();
    }
  };

  const medicalPuns = [
    "Looks like this page needs a check-up!",
    "We've lost the pulse on this page.",
    "This page is experiencing technical difficulties.",
    "404: Page not found in our medical records.",
    "Oops! This page took a sick day."
  ];

  const randomPun = medicalPuns[Math.floor(Math.random() * medicalPuns.length)];

  const quickLinks = [
    { href: '/documents', icon: FileText, label: 'Documents & Forms', description: 'Access medical forms' },
    { href: '/providers', icon: Users, label: 'Provider Directory', description: 'Find healthcare providers' },
    { href: '/directory', icon: ClipboardList, label: 'Contact Directory', description: 'Browse all contacts' },
    { href: '/knowledge', icon: Microscope, label: 'Knowledge Base', description: 'Learn about procedures' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      
      {/* Floating medical icons background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-primary/10"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Stethoscope size={80} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-20 text-secondary/10"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Microscope size={100} />
        </motion.div>
        <motion.div
          className="absolute top-40 right-40 text-primary/5"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        >
          <HeartHandshake size={120} />
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {/* Main content card with glass morphism */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-md bg-background/80 rounded-2xl shadow-2xl border border-border/50 p-8 md:p-12 max-w-4xl w-full"
        >
          {/* Animated illustration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <LostStethoscope className="w-64 h-48 text-primary" />
            </motion.div>
          </motion.div>

          {/* Error message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground">
              {randomPun}
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
              <Input
                type="search"
                placeholder="Search for what you need..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-6 text-lg"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Button 
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                Search
              </Button>
            </form>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Press <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted rounded">⌘K</kbd> to open quick search
            </p>
          </motion.div>

          {/* Quick action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mb-8"
          >
            <Button
              onClick={() => router.push('/')}
              className="gap-2"
              size="lg"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="gap-2"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </motion.div>

          {/* Helpful links section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-center mb-6">Popular Destinations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="group flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                  >
                    <link.icon className="h-5 w-5 text-primary mt-1 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {link.label}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-muted-foreground text-center mt-8"
        >
          If you believe this is an error, please contact our support team.
        </motion.p>
      </div>
    </div>
  );
}