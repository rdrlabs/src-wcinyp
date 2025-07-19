import { logger } from './logger-v2';

/**
 * Export Utility Functions for WCI@NYP Application
 * 
 * AI IMPLEMENTATION NOTES:
 * - These utilities handle exporting page data for design iteration
 * - Each export includes metadata for context and reimport
 * - Exports are self-documenting with structure info
 * - All exports include timestamp and version info for tracking
 */

import { toast } from 'sonner';

export interface ExportMetadata {
  exportedAt: string;
  exportedBy: string;
  appVersion: string;
  pageUrl: string;
  pageTitle: string;
  description: string;
  dataStructure?: Record<string, string>;
}

/**
 * Export data as JSON with metadata
 * 
 * @param data - The data to export
 * @param filename - Name for the downloaded file
 * @param metadata - Additional context about the export
 */
export function exportToJSON(
  data: unknown,
  filename: string,
  metadata?: Partial<ExportMetadata>
): void {
  try {
    const exportData = {
      // Metadata section for AI/design tool context
      _metadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: 'WCI@NYP Diagnostics Tool',
        appVersion: '1.0.0',
        format: 'json',
        ...metadata
      },
      // Actual data
      data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${filename}.json`);
  } catch (error) {
    logger.error('Export failed', error, 'ExportUtils');
    toast.error('Failed to export data');
  }
}

/**
 * Export tabular data as CSV
 * 
 * @param data - Array of objects to export
 * @param headers - Column headers mapping
 * @param filename - Name for the downloaded file
 */
export function exportToCSV(
  data: Record<string, unknown>[],
  headers: Record<string, string>,
  filename: string
): void {
  try {
    // Generate CSV header
    const csvHeaders = Object.values(headers).join(',');
    
    // Generate CSV rows
    const csvRows = data.map(row => {
      return Object.keys(headers).map(key => {
        const value = row[key] || '';
        // Escape quotes and wrap in quotes if contains comma
        const escapedValue = String(value).replace(/"/g, '""');
        return escapedValue.includes(',') ? `"${escapedValue}"` : escapedValue;
      }).join(',');
    });
    
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${filename}.csv`);
  } catch (error) {
    logger.error('Export failed', error, 'ExportUtils');
    toast.error('Failed to export data');
  }
}

/**
 * Export page-specific data with appropriate format
 * 
 * @param pageType - Type of page being exported
 * @param data - Page data to export
 * @param format - Export format (json or csv)
 */
export function exportPageData(
  pageType: 'home' | 'directory' | 'documents' | 'updates' | 'diagnostics',
  data: unknown,
  format: 'json' | 'csv' = 'json'
): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `wcinyp-${pageType}-${timestamp}`;
  
  // Page-specific metadata
  const pageMetadata: Record<string, Partial<ExportMetadata>> = {
    home: {
      pageTitle: 'WCI@NYP Landing Page',
      description: 'Main navigation hub with feature cards and labs section',
      dataStructure: {
        features: 'Array of main feature cards (Knowledge, Documents, Updates, Directory)',
        labsFeatures: 'Array of experimental features in development'
      }
    },
    directory: {
      pageTitle: 'Contact Directory',
      description: 'Comprehensive contact database with providers and locations',
      dataStructure: {
        contacts: 'Array of Contact objects with type, name, department, etc.',
        providers: 'Array of Provider objects with specialty, NPI, affiliations',
        locations: 'Array of Location entries with modalities and addresses'
      }
    },
    documents: {
      pageTitle: 'Document Hub',
      description: 'Document repository and form templates',
      dataStructure: {
        documents: 'Object with categories as keys, document arrays as values',
        forms: 'Array of FormTemplate objects with fields and metadata'
      }
    },
    updates: {
      pageTitle: 'Updates & Announcements',
      description: 'Latest news and operational updates',
      dataStructure: {
        announcements: 'Array of update objects with title, content, date, category'
      }
    },
    diagnostics: {
      pageTitle: 'System Diagnostics',
      description: 'Application health and configuration dashboard',
      dataStructure: {
        system: 'System information and environment details',
        theme: 'Theme configuration and settings',
        components: 'Component usage and health status'
      }
    }
  };
  
  if (format === 'json') {
    exportToJSON(data, filename, pageMetadata[pageType]);
  } else if (format === 'csv' && Array.isArray(data)) {
    // Define CSV headers based on page type
    const csvHeaders: Record<string, Record<string, string>> = {
      directory: {
        name: 'Name',
        type: 'Type',
        department: 'Department',
        phone: 'Phone',
        email: 'Email',
        location: 'Location'
      },
      documents: {
        name: 'Document Name',
        category: 'Category',
        size: 'Size',
        path: 'Path',
        lastUpdated: 'Last Updated'
      },
      updates: {
        title: 'Title',
        category: 'Category',
        date: 'Date',
        priority: 'Priority'
      }
    };
    
    const headers = csvHeaders[pageType] || {};
    exportToCSV(data, headers, filename);
  }
}

/**
 * Generate full page HTML export for design tools
 * 
 * AI IMPLEMENTATION NOTES:
 * - This creates a standalone HTML file with all styles inline
 * - Includes component structure documentation
 * - Preserves Tailwind classes for easy style modification
 * - Can be opened directly in browser or design tools
 */
export async function exportPageHTML(
  pageType: string,
  pageTitle: string,
  htmlContent: string
): Promise<void> {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `wcinyp-${pageType}-${timestamp}.html`;
    
    // Get current styles
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          logger.debug('Could not access stylesheet', e, 'ExportUtils');
          return '';
        }
      })
      .join('\n');
    
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle} - WCI@NYP Export</title>
  <style>
    /* Exported styles from WCI@NYP application */
    ${styles}
  </style>
  <!-- 
    WCI@NYP Page Export
    ==================
    Page: ${pageTitle}
    Exported: ${new Date().toISOString()}
    
    AI Implementation Notes:
    - This is a self-contained HTML export of a WCI@NYP page
    - All Tailwind classes are preserved for easy modification
    - Component structure matches the React implementation
    - Can be directly imported back with the same class names
    - Modify styles and return the HTML to update the design
  -->
</head>
<body>
  <div id="wcinyp-export-root">
    ${htmlContent}
  </div>
</body>
</html>`;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${filename}`);
  } catch (error) {
    logger.error('HTML export failed', error, 'ExportUtils');
    toast.error('Failed to export HTML');
  }
}

/**
 * Collect all data from a specific page
 * Used by diagnostics tool to gather page data for export
 */
export async function collectPageData(pageType: string): Promise<unknown> {
  switch (pageType) {
    case 'home':
      // Home page data structure
      return {
        features: [
          {
            title: "Knowledge Base",
            description: "Technical documentation, user guides, and best practices",
            href: "/knowledge",
            icon: "Brain"
          },
          {
            title: "Document Hub",
            description: "Centralized repository for forms and documents",
            href: "/documents",
            icon: "FileText"
          },
          {
            title: "Updates",
            description: "Latest news and operational updates",
            href: "/updates",
            icon: "Bell"
          },
          {
            title: "Directory",
            description: "Complete contact database",
            href: "/directory",
            icon: "Users"
          }
        ],
        labsFeatures: [
          {
            title: "MRI 3D Visualization Suite",
            description: "Interactive 3D models with positioning references",
            isPlaceholder: false
          },
          {
            title: "Centralized SPC Schedule",
            description: "View Schedulefly schedule natively",
            isPlaceholder: false
          }
        ]
      };
      
    case 'directory':
      // Load actual data from JSON files
      const contactsModule = await import('@/data/contacts.json');
      const providersModule = await import('@/data/providers.json');
      return {
        contacts: contactsModule.default.contacts,
        providers: providersModule.default.providers
      };
      
    case 'documents':
      // Load document data
      const documentsModule = await import('@/data/documents.json');
      const formsModule = await import('@/data/form-templates.json');
      return {
        documents: documentsModule.default,
        forms: formsModule.default.templates
      };
      
    case 'updates':
      // Updates data structure
      return {
        announcements: [
          {
            id: 1,
            title: "New MRI Safety Protocols",
            category: "Safety",
            date: "2025-01-10",
            priority: "high",
            content: "Updated screening procedures for all MRI examinations"
          }
        ]
      };
      
    default:
      return null;
  }
}