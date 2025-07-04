'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Users,
  Building,
  AlertCircle,
  Briefcase,
  MapPin,
  Search,
  Home,
  ChevronRight,
  Book,
  ArrowLeft
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getWikiPage } from '@/lib/wiki-loader';

// Wiki structure - maps to our content/wiki directory
const wikiStructure = {
  policies: {
    title: 'Policies',
    icon: FileText,
    description: 'Official WCINYP policies and guidelines',
    color: 'blue'
  },
  procedures: {
    title: 'Procedures',
    icon: Briefcase,
    description: 'Step-by-step guides for common tasks',
    color: 'green'
  },
  locations: {
    title: 'Locations',
    icon: MapPin,
    description: 'Information about WCINYP facilities',
    color: 'purple'
  },
  departments: {
    title: 'Departments',
    icon: Building,
    description: 'Department-specific information',
    color: 'orange'
  },
  emergency: {
    title: 'Emergency',
    icon: AlertCircle,
    description: 'Emergency procedures and contacts',
    color: 'red'
  },
  workflows: {
    title: 'Workflows',
    icon: Users,
    description: 'Common workflow documentation',
    color: 'indigo'
  }
};


export default function WikiPage() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'index';
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Load content from our wiki loader
    const page = getWikiPage(section);
    if (page) {
      setContent(page.content);
    } else {
      // Fallback to index if section not found
      const indexPage = getWikiPage('index');
      setContent(indexPage?.content || '# Page Not Found');
    }
    setLoading(false);
  }, [section]);

  const filteredSections = Object.entries(wikiStructure).filter(([, value]) =>
    value.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    value.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSection = section !== 'index' ? wikiStructure[section as keyof typeof wikiStructure] : null;

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/wiki" className="hover:text-primary">Wiki</Link>
          {currentSection && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span>{currentSection.title}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Book className="h-8 w-8" />
              WCINYP Staff Wiki
            </h1>
            <p className="text-muted-foreground mt-2">
              Your comprehensive guide to policies, procedures, and operations
            </p>
          </div>
          
          {section !== 'index' && (
            <Button
              variant="outline"
              onClick={() => window.location.href = '/wiki'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Wiki Home
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search wiki..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Navigation Links */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Wiki Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Link
                  href="/wiki"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    section === 'index' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Wiki Home
                </Link>
                
                {filteredSections.map(([key, value]) => {
                  const Icon = value.icon;
                  return (
                    <Link
                      key={key}
                      href={`/wiki?section=${key}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        section === key ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {value.title}
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/directory" className="text-sm text-primary hover:underline block">
                  Contact Directory
                </Link>
                <Link href="/documents" className="text-sm text-primary hover:underline block">
                  Document Hub
                </Link>
                <Link href="/forms" className="text-sm text-primary hover:underline block">
                  Forms Generator
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {loading ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  Loading content...
                </div>
              </CardContent>
            </Card>
          ) : section === 'index' ? (
            /* Wiki Home - Show category cards */
            <div className="space-y-8">
              <Card>
                <CardContent className="py-8">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(wikiStructure).map(([key, value]) => {
                  const Icon = value.icon;
                  const colorClasses = {
                    blue: 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700',
                    green: 'border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700',
                    purple: 'border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700',
                    orange: 'border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700',
                    red: 'border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700',
                    indigo: 'border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700',
                  };
                  
                  return (
                    <Link key={key} href={`/wiki?section=${key}`}>
                      <Card className={`cursor-pointer transition-all hover:shadow-lg ${colorClasses[value.color as keyof typeof colorClasses]}`}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            {value.title}
                          </CardTitle>
                          <CardDescription>{value.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Section Content */
            <Card>
              <CardHeader>
                {currentSection && (
                  <>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <currentSection.icon className="h-6 w-6" />
                      {currentSection.title}
                    </CardTitle>
                    <CardDescription>{currentSection.description}</CardDescription>
                  </>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card className="mt-8 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Can&apos;t find what you&apos;re looking for? Contact us for assistance.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/directory">View Contacts</Link>
                </Button>
                <Button size="sm" variant="outline">
                  Email: wiki@wcinyp.org
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}